import tss from 'typescript/lib/tsserverlibrary';
import { mergePluginOptions, TsAutoMapperPluginOptions } from './merge-options';
import { ModelVisitor } from './model-visitor';
import { isFilenameMatched } from './plugin-utils';

const modelVisitor = new ModelVisitor();

export default function tsAutomapperPlugin(
  program: tss.Program,
  opts?: TsAutoMapperPluginOptions
) {
  const options = mergePluginOptions(opts);
  return {
    before(ctx: tss.TransformationContext) {
      return (sf: tss.SourceFile) => {
        if (isFilenameMatched(options.modelFileNameSuffix || [], sf.fileName)) {
          return modelVisitor.visit(sf, ctx, program);
        }
        return sf;
      };
    },
  };
}

export const before = (
  options?: TsAutoMapperPluginOptions,
  program?: tss.Program
) => {
  return tsAutomapperPlugin(program as tss.Program, options).before;
};
