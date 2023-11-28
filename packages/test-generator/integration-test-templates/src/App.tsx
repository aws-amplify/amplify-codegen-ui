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
import { Amplify } from 'aws-amplify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentTests from './ComponentTests';
import GenerateTests from './GenerateTests';
import PrimitivesTests from './PrimitivesTests';
import ComplexTests from './ComplexTests';
import SnippetTests from './SnippetTests'; // eslint-disable-line import/extensions
import WorkflowTests from './WorkflowTests';
import TwoWayBindingTests from './TwoWayBindingTests';
import ActionBindingTests from './ActionBindingTests';
import FormTests from './FormTests';
import { DATA_STORE_MOCK_EXPORTS, AUTH_MOCK_EXPORTS } from './mock-utils';

// use fake endpoint so useDataStoreBinding does not fail
Amplify.configure({
  ...DATA_STORE_MOCK_EXPORTS,
  ...AUTH_MOCK_EXPORTS,
});

const HomePage = () => {
  return (
    <div>
      <h1>Codegen UI Functional Tests</h1>
      <ul>
        <li>
          <a href="/component-tests">Component Tests</a>
        </li>
        <li>
          <a href="/generate-tests">Browser Generation Tests</a>
        </li>
        <li>
          <a href="/primitives-tests">Primitives Tests</a>
        </li>
        <li>
          <a href="/complex-tests">Complex Tests</a>
        </li>
        <li>
          <a href="/snippet-tests">Snippet Tests</a>
        </li>
        <li>
          <a href="/workflow-tests">Workflow Tests</a>
        </li>
        <li>
          <a href="/two-way-binding-tests">Two Way Binding Tests</a>
        </li>
        <li>
          <a href="/action-binding-tests">Action Binding Test</a>
        </li>
        <li>
          <a href="/form-tests">Form Tests</a>
        </li>
      </ul>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/component-tests" element={<ComponentTests />} />
        <Route path="/generate-tests" element={<GenerateTests />} />
        <Route path="/primitives-tests" element={<PrimitivesTests />} />
        <Route path="/complex-tests" element={<ComplexTests />} />
        <Route path="/snippet-tests" element={<SnippetTests />} />
        <Route path="/workflow-tests" element={<WorkflowTests />} />
        <Route path="/two-way-binding-tests" element={<TwoWayBindingTests />} />
        <Route path="/action-binding-tests" element={<ActionBindingTests />} />
        <Route path="/form-tests/:subject?" element={<FormTests />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
