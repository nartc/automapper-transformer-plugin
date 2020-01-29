import tss from 'typescript/lib/tsserverlibrary';

export function hasPropertyKey(
  key: string,
  properties: ts.NodeArray<tss.PropertyAssignment>
): boolean {
  return properties
    .filter(item => !isDynamicallyAdded(item))
    .some(item => item.name.getText() === key);
}

export function isDynamicallyAdded(identifier: tss.Node) {
  return identifier && !identifier.parent && identifier.pos === -1;
}

export function isPrimitiveType(type: tss.Type): boolean {
  return (
    type.flags === tss.TypeFlags.String ||
    type.flags === tss.TypeFlags.Number ||
    type.flags === tss.TypeFlags.Boolean
  );
}

export function getDecoratorName(decorator: tss.Decorator): string | undefined {
  const isDecoratorFactory =
    decorator.expression.kind === tss.SyntaxKind.CallExpression;
  if (isDecoratorFactory) {
    const callExpression = decorator.expression;
    const expression = (callExpression as tss.CallExpression).expression;
    const identifier = expression as tss.Identifier;
    if (isDynamicallyAdded(identifier)) {
      return undefined;
    }

    return getIdentifierFromExpression(expression).getText();
  }
  return getIdentifierFromExpression(decorator.expression).getText();
}

function getIdentifierFromExpression(
  expression: tss.LeftHandSideExpression
): tss.Identifier {
  const identifier = getNameFromExpression(expression);
  if (identifier && identifier.kind !== tss.SyntaxKind.Identifier) {
    throw new Error();
  }
  return identifier as tss.Identifier;
}

function getNameFromExpression(
  expression: tss.LeftHandSideExpression
): tss.Identifier | tss.LeftHandSideExpression {
  if (
    expression &&
    expression.kind === tss.SyntaxKind.PropertyAccessExpression
  ) {
    return (expression as tss.PropertyAccessExpression).name;
  }
  return expression;
}
