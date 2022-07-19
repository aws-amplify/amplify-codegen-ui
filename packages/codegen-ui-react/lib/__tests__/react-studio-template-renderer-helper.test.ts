/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { StudioTemplateRendererFactory, StudioComponent } from '@aws-amplify/codegen-ui';
import { ScriptTarget, ScriptKind } from '..';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import { formatCode, getDeclarationFilename } from '../react-studio-template-renderer-helper';
import { loadSchemaFromJSONFile } from './__utils__';

function generateDeclarationForScriptTarget(jsonSchemaFile: string, target: ScriptTarget): any {
  const rendererFactory = new StudioTemplateRendererFactory(
    (component: StudioComponent) =>
      new AmplifyRenderer(component, { target, script: ScriptKind.JS, renderTypeDeclarations: true }),
  );
  const component = rendererFactory.buildRenderer(loadSchemaFromJSONFile(jsonSchemaFile)).renderComponent();
  return (component as unknown as { declaration: string }).declaration;
}

describe('react-studio-template-renderer-helper', () => {
  describe('transpile', () => {
    it('successfully transpiles with ScriptTarget ES3', () => {
      expect(generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES3)).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES5', () => {
      expect(generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES5)).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2015', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2015),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2016', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2016),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2017', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2017),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2018', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2018),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2019', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2019),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2020', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2020),
      ).toMatchSnapshot();
    });

    it('successfully transpiles with ScriptTarget ES2021', () => {
      expect(
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ES2021),
      ).toMatchSnapshot();
    });

    it('fails to transpile with ScriptTarget ESNext', () => {
      expect(() => {
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.ESNext);
      }).toThrowErrorMatchingSnapshot();
    });

    it('fails to transpile with ScriptTarget Latest', () => {
      expect(() => {
        generateDeclarationForScriptTarget('custom/customParentAndChildren', ScriptTarget.Latest);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('formatCode', () => {
    const code = 'const foo = 1;     const bar    =  false;';

    it('formats code when prettier is installed', () => {
      expect(formatCode(code)).toMatchSnapshot();
    });

    it('does not format code when prettier is not installed', () => {
      jest.mock('prettier', () => {
        throw new Error('Mock module not installed.');
      });

      expect(formatCode(code)).toEqual(code);
    });

    it('does not swallow prettier errors', () => {
      jest.mock('prettier', () => ({
        format: jest.fn(() => {
          throw new Error('Failed to format');
        }),
      }));

      expect(() => formatCode(code)).toThrowErrorMatchingSnapshot();
    });
  });
  describe('generate declaration file', () => {
    it('generate declaration file with .tsx extension', () => {
      expect(getDeclarationFilename('component/TestComponent.tsx')).toEqual('TestComponent.d.ts');
    });

    it('generate declaration file with .jsx extension', () => {
      expect(getDeclarationFilename('component/TestComponent.jsx')).toEqual('TestComponent.d.ts');
      console.log('DONE');
    });
  });
});
