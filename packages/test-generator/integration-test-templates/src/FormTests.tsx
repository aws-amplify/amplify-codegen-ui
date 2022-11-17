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
import { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import {
  CustomFormCreateDog,
  DataStoreFormCreateAllSupportedFormFields,
  CustomFormCreateNestedJson,
} from './ui-components'; // eslint-disable-line import/extensions, max-len
import { AllSupportedFormFields } from './models';

export default function FormTests() {
  const [customFormCreateDogSubmitResults, setCustomFormCreateDogSubmitResults] = useState<any>({});

  const [isInitialized, setInitialized] = useState(false);
  const [dataStoreFormCreateAllSupportedFormFieldsRecord, setDataStoreFormCreateAllSupportedFormFieldsRecord] =
    useState('');
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore').onsuccess = async function () {
        setInitialized(true);
      };
    };

    initializeTestState();
    initializeStarted.current = true;
  }, []);

  if (!isInitialized) {
    return null;
  }

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
      <Heading>DataStore Form - CreateAllSupportedFormFields</Heading>
      <View id="dataStoreFormCreateAllSupportedFormFields">
        <DataStoreFormCreateAllSupportedFormFields
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields);
            setDataStoreFormCreateAllSupportedFormFieldsRecord(JSON.stringify(records[0]));
          }}
        />
        <Text>{dataStoreFormCreateAllSupportedFormFieldsRecord}</Text>
      </View>
      <Divider />
      <Heading>Custom Form - CreateNestedJson</Heading>
      <View id="customFormCreateNestedJson">
        <CustomFormCreateNestedJson onSubmit={() => undefined} />
      </View>
    </AmplifyProvider>
  );
}
