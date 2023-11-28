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
import { AmplifyProvider, View, Heading, Text } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { CustomFormCreateDog } from '../ui-components'; // eslint-disable-line import/extensions, max-len

export default function () {
  const [customFormCreateDogResults, setCustomFormCreateDogResults] = useState<any>({});

  return (
    <AmplifyProvider>
      <Heading>CustomFormCreateDog</Heading>
      <View id="CustomFormCreateDog">
        <CustomFormCreateDog
          onSubmit={(r) => setCustomFormCreateDogResults(r)}
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
        <View>{`submitted: ${!!Object.keys(customFormCreateDogResults).length}`}</View>
        <View>{`name: ${customFormCreateDogResults.name}`}</View>
        <Text>{`name: ${customFormCreateDogResults.name}`}</Text>
        <Text>{`age: ${customFormCreateDogResults.age}`}</Text>
        <Text>{`email: ${customFormCreateDogResults.email}`}</Text>
        <Text>{`ip: ${customFormCreateDogResults.ip}`}</Text>
        <Text>{`ip: ${customFormCreateDogResults.breed}`}</Text>
        <Text>{`color: ${customFormCreateDogResults.color}`}</Text>
      </View>
    </AmplifyProvider>
  );
}
