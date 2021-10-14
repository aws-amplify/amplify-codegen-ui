import { ScriptKind } from 'typescript';
import { scriptKindToFileExtension } from '../react-render-config';

describe('ReactRenderConfig', () => {
  describe('scriptKindToFileExtension', () => {
    test('JS', () => {
      expect(scriptKindToFileExtension(ScriptKind.JS)).toEqual('js');
    });

    test('JSX', () => {
      expect(scriptKindToFileExtension(ScriptKind.JSX)).toEqual('jsx');
    });

    test('TSX', () => {
      expect(scriptKindToFileExtension(ScriptKind.TSX)).toEqual('tsx');
    });

    test('TS (not supported)', () => {
      expect(() => scriptKindToFileExtension(ScriptKind.TS)).toThrow(new Error('Invalid script kind: TS'));
    });
  });
});
