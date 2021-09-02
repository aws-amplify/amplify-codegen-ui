import { FrameworkOutputConfig } from '@amzn/studio-ui-codegen';

export type ReactOutputConfig = FrameworkOutputConfig & {
  /**
   * @name outputFormat
   * @type string
   * @description required, the format of react ui codegen.
   * @values 'ts' | 'tsx' | 'js' | 'jsx'
   * @default jsx
   */
  outputFormat: JSOutputFormatEnum;
  // ES5,ES6
  compileTarget: CompileTargetEnum;
  // CommonJS, ESModule
  module: JSModuleEnum;
};

export enum JSOutputFormatEnum {
  ts = 'ts',
  tsx = 'tsx',
  js = 'js',
  jsx = 'jsx',
}
export enum CompileTargetEnum {
  ES5 = 'ES5',
  ES6 = 'ES6',
}
export enum JSModuleEnum {
  CommonJS = 'CommonJS',
  ESModule = 'ESModule',
}
