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
import { AmplifyProvider, View, Heading } from '@aws-amplify/ui-react';
import { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateAllSupportedFormFields } from './ui-components'; // eslint-disable-line import/extensions, max-len
import { User } from './models';

const initializeUserTestData = async (): Promise<void> => {
  await DataStore.save(new User({ firstName: 'John', lastName: 'Lennon', age: 29 }));
  await DataStore.save(new User({ firstName: 'Paul', lastName: 'McCartney', age: 72 }));
  await DataStore.save(new User({ firstName: 'George', lastName: 'Harrison', age: 50 }));
  await DataStore.save(new User({ firstName: 'Ringo', lastName: 'Starr', age: 5 }));
};

export default function UpdateFormTests() {
  const [isInitialized, setInitialized] = useState(false);

  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeUserTestData();
      setInitialized(true);
    };

    initializeTestState();
    initializeStarted.current = true;
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <AmplifyProvider>
      <Heading>DataStore Form - UpdateAllSupportedFormFields</Heading>
      <View id="dataStoreFormUpdateAllSupportedFormFields">
        <DataStoreFormUpdateAllSupportedFormFields />
      </View>
    </AmplifyProvider>
  );
}
