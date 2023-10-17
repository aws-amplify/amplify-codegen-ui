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
import { renderExpanderJsxElement, renderTableJsxElement, renderWithAmplifyViewRenderer } from './__utils__';

describe('amplify table renderer tests', () => {
  test('should generate a table element', () => {
    const tableElement = renderTableJsxElement('views/table-from-datastore', 'datastore/person', 'test-table.ts');
    expect(tableElement).toMatchSnapshot();
  });

  test('should generate a non-datastore table element', () => {
    const tableElement = renderTableJsxElement('views/table-from-custom-json', undefined, 'test-custom-table.ts');
    expect(tableElement).toMatchSnapshot();
  });
});

describe('amplify expander renderer tests', () => {
  test('should generate expander with an expander item that has a component as a child', () => {
    const expander = renderExpanderJsxElement(
      'views/expander-with-component-slot',
      undefined,
      'test-expander-component-slot.ts',
    );
    expect(expander).toMatchSnapshot();
  });

  test('should generate expander with an expander item that has a data binding as a child', () => {
    const expander = renderExpanderJsxElement(
      'views/expander-with-binding-prop',
      undefined,
      'test-expander-binding-prop.ts',
    );
    expect(expander).toMatchSnapshot();
  });
});

describe('amplify view renderer tests', () => {
  test('should render view with passed in predicate and sort', () => {
    const { componentText, declaration } = renderWithAmplifyViewRenderer(
      'views/post-table-datastore',
      'datastore/post-ds',
    );
    expect(componentText).toContain('useDataStoreBinding');
    expect(componentText).toMatchSnapshot();
    expect(declaration).toMatchSnapshot();
  });
  test('should render view with custom datastore', () => {
    const { componentText, declaration } = renderWithAmplifyViewRenderer('views/table-from-custom-json', undefined);
    expect(componentText).not.toContain('useDataStoreBinding');
    expect(componentText).toMatchSnapshot();
    expect(declaration).toMatchSnapshot();
  });

  test('should call util file if rendered', () => {
    const { componentText, declaration } = renderWithAmplifyViewRenderer(
      'views/post-table-custom-format',
      'datastore/post-ds',
    );
    expect(componentText.replace(/\\/g, '')).toContain('formatter');
    expect(componentText).toMatchSnapshot();
    expect(declaration).toMatchSnapshot();
  });
});
