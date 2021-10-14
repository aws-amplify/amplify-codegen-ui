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
import React, { useState, SyntheticEvent } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, View, Heading, Divider } from '@aws-amplify/ui-react';
import { Event } from './ui-components'; // eslint-disable-line import/extensions

export default function ComplexTests() {
  const [textChanged, setTextChanged] = useState('');
  const [buttonClicked, setButtonClicked] = useState('');
  return (
    <AmplifyProvider>
      <Heading>Event</Heading>
      <View id="event">
        <Event
          onTextFieldChange={(event: SyntheticEvent) => {
            setTextChanged((event.target as HTMLInputElement).value);
          }}
          onButtonClick={() => {
            setButtonClicked('button clicked');
          }}
          textChanged={textChanged}
          buttonClicked={buttonClicked}
        />
      </View>
      <Divider />
    </AmplifyProvider>
  );
}
