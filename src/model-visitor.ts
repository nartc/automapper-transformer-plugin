import compact from 'lodash.compact';
import flatten from 'lodash.flatten';
import tss from 'typescript/lib/tsserverlibrary';
import { hasPropertyKey, isPrimitiveType } from './ast-utils';
import { AUTOMAPPER_DECORATOR, AUTOMAPPER_METADATA_FACTORY } from './constants';
import {
  getDecoratorOrUndefinedByNames,
  getTypeReferenceAsString,
  replaceImportPath,
} from './plugin-utils';

export class ModelVisitor {
  private readonly metadataMap = new Map<string, any>();

  visit(
    sourceFile: tss.SourceFile,
    context: tss.TransformationContext,
    program: tss.Program
  ) {
    const typeChecker = program.getTypeChecker();

    function visitor(
      modelVisitor: ModelVisitor,
      ctx: tss.TransformationContext,
      sf: tss.SourceFile
    ): tss.Visitor {
      const _visitor: tss.Visitor = (node: tss.Node) => {
        if (tss.isClassDeclaration(node)) {
          node = tss.visitEachChild(node, _visitor, ctx);
          return modelVisitor.addMetadataFactory(node as tss.ClassDeclaration);
        } else if (tss.isPropertyDeclaration(node) || tss.isGetAccessor(node)) {
          const decorators = node.decorators;
          const existingAutoMapDecorator = getDecoratorOrUndefinedByNames(
            [AUTOMAPPER_DECORATOR],
            decorators
          );

          if (!!existingAutoMapDecorator) {
            return node;
          }

          const isPropertyStaticOrPrivate = (node.modifiers || []).some(
            modifier =>
              modifier.kind === tss.SyntaxKind.StaticKeyword ||
              modifier.kind === tss.SyntaxKind.PrivateKeyword
          );

          if (isPropertyStaticOrPrivate) {
            return node;
          }

          modelVisitor.inspectNode(
            node,
            typeChecker,
            tss.createNodeArray<tss.PropertyAssignment>(),
            sf
          );
          return node;
        }
        return tss.visitEachChild(node, _visitor, ctx);
      };

      return _visitor;
    }

    return tss.visitNode(sourceFile, visitor(this, context, sourceFile));
  }

  private addMetadataFactory(
    classNode: tss.ClassDeclaration
  ): tss.ClassDeclaration {
    const classMetadata = this.getClassMetadata(classNode);
    if (!classMetadata) {
      return classNode;
    }
    const classMutableNode = tss.getMutableClone(classNode);
    const returnValue = tss.createObjectLiteral(Object.values(classMetadata));
    const method = tss.createMethod(
      undefined,
      [tss.createModifier(tss.SyntaxKind.StaticKeyword)],
      undefined,
      tss.createIdentifier(AUTOMAPPER_METADATA_FACTORY),
      undefined,
      undefined,
      [],
      undefined,
      tss.createBlock([tss.createReturn(returnValue)], true)
    );
    classMutableNode.members = tss.createNodeArray([
      ...classMutableNode.members,
      method,
    ]);
    return classMutableNode;
  }

  private getClassMetadata(classNode: tss.ClassDeclaration) {
    if (!classNode.name) {
      return;
    }
    return this.metadataMap.get(classNode.name.getText());
  }

  private addClassMetadata(
    propertyNode: tss.PropertyDeclaration | tss.GetAccessorDeclaration,
    objectLiteral: tss.ObjectLiteralExpression,
    sourceFile: tss.SourceFile
  ): void {
    const hostClass = propertyNode.parent;
    const className = (hostClass as tss.ClassDeclaration).name?.getText();
    if (!className) {
      return;
    }

    const existingMetadata = this.metadataMap.get(className) || {};
    const propertyName = propertyNode.name?.getText(sourceFile);
    if (
      !propertyName ||
      (propertyNode.name &&
        propertyNode.name.kind === tss.SyntaxKind.ComputedPropertyName)
    ) {
      return;
    }

    this.metadataMap.set(className, {
      ...existingMetadata,
      [propertyName]: objectLiteral.properties[0],
    });
  }

  private inspectNode(
    node: tss.PropertyDeclaration | tss.GetAccessorDeclaration,
    typeChecker: tss.TypeChecker,
    existingProperties: tss.NodeArray<
      tss.PropertyAssignment
    > = tss.createNodeArray<tss.PropertyAssignment>(),
    sourceFile: tss.SourceFile
  ): void {
    const properties = [
      ...existingProperties,
      ModelVisitor.createPropertyAssignment(
        node,
        typeChecker,
        existingProperties,
        sourceFile.fileName
      ),
    ];
    const objectLiteral = tss.createObjectLiteral(compact(flatten(properties)));
    this.addClassMetadata(node, objectLiteral, sourceFile);
  }

  private static createPropertyAssignment(
    node: tss.PropertyDeclaration | tss.GetAccessorDeclaration,
    typeChecker: tss.TypeChecker,
    existingProperties: tss.NodeArray<tss.PropertyAssignment>,
    hostFileName: string
  ): tss.PropertyAssignment | undefined {
    const key = node.name?.getText();
    if (!key || hasPropertyKey(key, existingProperties)) {
      return undefined;
    }

    const type = typeChecker.getTypeAtLocation(node);
    if (!type) {
      return undefined;
    }

    if (isPrimitiveType(type)) {
      return tss.createPropertyAssignment(key, tss.createNull());
    }

    if (!type.isClass() && node.type && tss.isClassOrTypeElement(node.type)) {
      return undefined;
    }
    let typeReference = getTypeReferenceAsString(type, typeChecker);
    typeReference =
      typeReference === 'any' ? node.type?.getText() || '' : typeReference;
    if (!typeReference) {
      return undefined;
    }

    typeReference = replaceImportPath(typeReference, hostFileName);
    return tss.createPropertyAssignment(
      key,
      tss.createIdentifier(typeReference as string)
    );
  }
}
