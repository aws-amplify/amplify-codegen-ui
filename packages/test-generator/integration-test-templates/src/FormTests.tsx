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
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, View, Heading, Divider, Text } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { CustomFormCreateDog } from './ui-components'; // eslint-disable-line import/extensions

export default function FormTests() {
  const [customFormCreateDogSubmitResults, setCustomFormCreateDogSubmitResults] = useState<any>({});
  return (
    <AmplifyProvider>
      <Heading>Custom Form - CreateDog</Heading>
      <View id="customFormCreateDog">
        <CustomFormCreateDog
          onSubmit={(r) => setCustomFormCreateDogSubmitResults(r)}
          onValidate={{
            email: (value, validationResponse) => {
              if (validationResponse.hasError) {
                return validationResponse;
              }
              if (!value?.includes('yahoo.com')) {
                return { hasError: true, errorMessage: 'All dog emails are yahoo emails' };
              }
              return { hasError: false };
            },
          }}
        />
        <View>{`submitted: ${!!Object.keys(customFormCreateDogSubmitResults).length}`}</View>
        <View>{`name: ${customFormCreateDogSubmitResults.name}`}</View>
        <Text>{`name: ${customFormCreateDogSubmitResults.name}`}</Text>
        <Text>{`age: ${customFormCreateDogSubmitResults.age}`}</Text>
        <Text>{`email: ${customFormCreateDogSubmitResults.email}`}</Text>
        <Text>{`ip: ${customFormCreateDogSubmitResults.ip}`}</Text>
      </View>
      <Divider />
    </AmplifyProvider>
  );
}
