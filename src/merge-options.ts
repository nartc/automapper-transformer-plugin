export interface TsAutoMapperPluginOptions {
  modelFileNameSuffix?: string[];
}

const defaultOptions: TsAutoMapperPluginOptions = {
  modelFileNameSuffix: ['.model.ts', '.vm.ts'],
};

export const mergePluginOptions = (
  options: Record<string, any> = {}
): TsAutoMapperPluginOptions => {
  return {
    ...defaultOptions,
    ...options,
  };
};
