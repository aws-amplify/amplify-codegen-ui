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
import { createDataStorePredicate } from '@aws-amplify/ui-react/internal';
import { useState, useRef, useEffect } from 'react';
import { ListingExpanderWithComponentSlot, MyTheme } from './ui-components'; // eslint-disable-line import/extensions
import { initializeListingTestData } from './mock-utils';

export default function FormTests() {
  const [isInitialized, setInitialized] = useState(false);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestUserData = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      const ddbRequest = indexedDB.deleteDatabase('amplify-datastore');
      await new Promise((res, rej) => {
        ddbRequest.onsuccess = () => {
          res(true);
        };
        ddbRequest.onerror = () => {
          rej(ddbRequest.error);
        };
      });
      await Promise.all([initializeListingTestData()]);
      setInitialized(true);
    };

    initializeTestUserData();
    initializeStarted.current = true;
  }, []);

  if (!isInitialized) {
    return null;
  }
  return (
    <AmplifyProvider theme={MyTheme}>
      <View id="expanderWithSlot">
        <Heading>Expander with Component Slot</Heading>
        <ListingExpanderWithComponentSlot />
      </View>
      <View id="expanderWithPredicateOverride">
        <Heading>Expander with Component Slot</Heading>
        <ListingExpanderWithComponentSlot
          predicateOverride={createDataStorePredicate({
            field: 'title',
            operand: 'Cozy Bungalow',
            operator: 'eq',
          })}
        />
      </View>
    </AmplifyProvider>
  );
}
