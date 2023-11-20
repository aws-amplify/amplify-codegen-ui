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
import './GenerateTests.css';
import { useState, useEffect, useCallback } from 'react';
import { BrowserTestGenerator, TestCase } from '@aws-amplify/codegen-ui-test-generator';
import { InvalidInputError, InternalError } from '@aws-amplify/codegen-ui';
import { ScriptKind, ScriptTarget } from 'typescript';

const defaultGenerator = new BrowserTestGenerator({
  writeToLogger: true,
  writeToDisk: false,
});

const generatorConfigs = {
  ES2016_TSX: {
    target: ScriptTarget.ES2016,
    script: ScriptKind.TSX,
  },
  ES2016_JSX: {
    target: ScriptTarget.ES2016,
    script: ScriptKind.JSX,
  },
  ES5_TSX: {
    target: ScriptTarget.ES5,
    script: ScriptKind.TSX,
  },
  ES5_JSX: {
    target: ScriptTarget.ES5,
    script: ScriptKind.JSX,
  },
};

const generators = Object.fromEntries(
  Object.entries(generatorConfigs).map(([generatorTarget, renderConfigOverride]) => {
    return [
      generatorTarget,
      new BrowserTestGenerator({
        writeToLogger: true,
        writeToDisk: false,
        renderConfigOverride,
        immediatelyThrowGenerateErrors: true,
      }),
    ];
  }),
);

const targetValues = Object.keys(generators);

type GenerateTestCaseProps = {
  testCase: TestCase;
  executeImmediately: boolean;
};

type TestResult = {
  result: 'PASSED' | 'FAILED';
  errorType?: any;
};

const GenerateTestCase = (props: GenerateTestCaseProps) => {
  const { testCase, executeImmediately } = props;
  const { name, testType } = testCase;
  const [testState, setTestState] = useState<{ [index: string]: TestResult }>({});

  const generateComponent = useCallback(() => {
    Object.entries(generators).forEach(([targetName, generator]) => {
      try {
        generator.generate([testCase]);
        setTestState((previousTestState) => {
          const clonedState = { ...previousTestState };
          clonedState[targetName] = { result: 'PASSED' };
          return clonedState;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Generate error for: ${name} - ${targetName}`, e);
        const errorType = e instanceof InvalidInputError || e instanceof InternalError ? e.constructor.name : e;
        setTestState((previousTestState) => {
          const clonedState = { ...previousTestState };
          clonedState[targetName] = { result: 'FAILED', errorType };
          return clonedState;
        });
      }
    });
  }, [name, testCase]);

  useEffect(() => {
    if (executeImmediately) {
      generateComponent();
    }
  }, [executeImmediately, generateComponent]);

  return (
    <tr id={`generateTest${name}`} className="generateTest">
      <td>
        <button onClick={generateComponent}>Generate</button>
      </td>
      <td>{name}</td>
      <td>{testType}</td>
      {targetValues.map((targetName) => (
        <td className={targetName}>
          {testState[targetName] &&
            (testState[targetName].result === 'PASSED' ? ' ✅' : ` ❌ - ${testState[targetName].errorType}`)}
        </td>
      ))}
    </tr>
  );
};

export default function GenerateTests() {
  const [generateAll, setGenerateAll] = useState(false);
  const testCases = defaultGenerator.getTestCases();
  // only test snippet with 4 components for performance
  const snippetTestCases: TestCase[] = testCases
    .filter((testCase) => testCase.testType === 'Component')
    .slice(0, 4)
    .map((testCase) => ({ ...testCase, testType: 'Snippet' }));
  const testCasesWithSnippets = testCases.concat(snippetTestCases);
  const testCaseComponents = testCasesWithSnippets.map((testCase) => (
    <GenerateTestCase testCase={testCase} executeImmediately={generateAll} />
  ));
  return (
    <div>
      <h1>Browser Generation Tests</h1>
      <button
        id="btnGenerateAll"
        onClick={() => {
          setGenerateAll(true);
        }}
      >
        Generate All
      </button>
      <table>
        <tr>
          <th>Generate</th>
          <th>Test Name</th>
          <th>Test Type</th>
          {targetValues.map((targetName) => (
            <th>{targetName}</th>
          ))}
        </tr>
        {testCaseComponents}
      </table>
      <div></div>
    </div>
  );
}
