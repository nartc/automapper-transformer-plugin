import { dirname, posix } from 'path';
import tss from 'typescript/lib/tsserverlibrary';
import {
  getDecoratorName,
  getText,
  isArrayType,
  isBoolean,
  isDate,
  isNumber,
  isString,
} from './ast-utils';

export function isFilenameMatched(patterns: string[], filename: string) {
  return patterns.some((path) => filename.includes(path));
}

export function getDecoratorOrUndefinedByNames(
  names: string[],
  decorators?: tss.NodeArray<tss.Decorator>
): tss.Decorator | undefined {
  return (decorators || tss.createNodeArray()).find((item) =>
    names.includes(getDecoratorName(item) as string)
  );
}

export function getTypeReferenceAsString(
  type: tss.Type,
  typeChecker: tss.TypeChecker
): string | undefined {
  if (isArrayType(type)) {
    const arrayType = (type as any).typeArguments[0];
    const elementType = getTypeReferenceAsString(arrayType, typeChecker);
    if (!elementType) {
      return undefined;
    }
    return `[${elementType}]`;
  }

  if (isBoolean(type)) {
    return Boolean.name;
  }

  if (isNumber(type)) {
    return Number.name;
  }

  if (isString(type)) {
    return String.name;
  }

  if (isDate(type)) {
    return Date.name;
  }

  if (type.isClass()) {
    return getText(type, typeChecker);
  }

  return undefined;
}

export function replaceImportPath(typeReference: string, fileName: string) {
  if (!typeReference.includes('import')) {
    return typeReference;
  }
  let importPath = /\("([^)]).+(")/.exec(typeReference)?.[0];
  if (!importPath) {
    return undefined;
  }
  importPath = importPath.slice(2, importPath.length - 1);

  let relativePath = posix.relative(dirname(fileName), importPath);
  relativePath = relativePath[0] !== '.' ? './' + relativePath : relativePath;
  typeReference = typeReference.replace(importPath, relativePath);

  return typeReference.replace('import', 'require');
}
