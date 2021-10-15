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
import React from 'react';
import { BrowserTestGenerator } from '@amzn/test-generator';
import logo from './logo.svg';
import './App.css';

function App() {
  const generator = new BrowserTestGenerator({
    writeToLogger: true,
    writeToDisk: false,
    disabledSchemas: [
      'BasicComponentCustom', // TODO: Add as part of basic components part 2
      'BasicComponentDivider', // TODO: Add as part of basic components part 2
      'BasicComponentFlex', // TODO: Add as part of basic components part 2
      'BasicComponentImage', // TODO: Add as part of basic components part 2
    ],
  });
  generator.generate();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
