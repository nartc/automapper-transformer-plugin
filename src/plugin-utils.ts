import tss from 'typescript/lib/tsserverlibrary';
import { getDecoratorName } from './ast-utils';

export function isFilenameMatched(patterns: string[], filename: string) {
  return patterns.some(path => filename.includes(path));
}

export function getDecoratorOrUndefinedByNames(
  names: string[],
  decorators?: tss.NodeArray<tss.Decorator>
): tss.Decorator | undefined {
  return (decorators || tss.createNodeArray()).find(item =>
    names.includes(getDecoratorName(item) as string)
  );
}
