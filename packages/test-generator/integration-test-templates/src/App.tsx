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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComponentTests from './ComponentTests';
import GenerateTests from './GenerateTests';
import PrimitivesTests from './PrimitivesTests';

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
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
