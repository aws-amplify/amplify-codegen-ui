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
import BoxTest from './ui-components/BoxTest';
import BoxWithButton from './ui-components/BoxWithButton';
import BoxWithButtonExposedAs from './ui-components/BoxWithButtonExposedAs';
import CustomButton from './ui-components/CustomButton';
import CustomText from './ui-components/CustomText';
import TextWithDataBinding from './ui-components/TextWithDataBinding';
// import ButtonWithConcatenatedText from './ui-components/ButtonWithConcatenatedText';
// import ButtonWithConditionalState from './ui-components/ButtonWithConditionalState';
/* eslint-enable import/extensions */

function App() {
  return (
    <>
      <BoxTest />
      <BoxWithButton />
      <BoxWithButtonExposedAs />
      <CustomButton />
      <CustomText />
      <TextWithDataBinding />
      {/*
      TODO: buttonUser Listed as optional prop, but fails when not present
      <ButtonWithConcatenatedText />
      <ButtonWithConcatenatedText
        buttonUser={{
          firstname: 'Norm',
          lastname: 'Gunderson',
          isLoggedIn: true,
          loggedInColor: 'blue',
          loggedOutColor: 'red',
          age: -1,
        }}
       />
      <ButtonWithConditionalState
        buttonUser={{
          firstname: 'Disabled',
          lastname: 'Conditional Button',
          isLoggedIn: false,
          loggedInColor: 'blue',
          loggedOutColor: 'red',
          age: -1,
        }}
       />
      <ButtonWithConditionalState
        buttonUser={{
          firstname: 'May Vote',
          lastname: 'Conditional Button',
          age: 19,
          isLoggedIn: true,
          loggedInColor: 'blue',
          loggedOutColor: 'red',
        }}
      />
      <ButtonWithConditionalState
        buttonUser={{
          firstname: 'May Not Vote',
          lastname: 'Conditional Button',
          age: 16,
          isLoggedIn: true,
          loggedInColor: 'blue',
          loggedOutColor: 'red',
        }}
      />
      */}
    </>
  );
}

export default App;
