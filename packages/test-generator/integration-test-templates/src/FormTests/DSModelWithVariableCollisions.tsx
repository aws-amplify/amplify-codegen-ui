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
import { AmplifyProvider, View, Heading, Text } from '@aws-amplify/ui-react';
import { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
// eslint-disable-next-line import/extensions
import { DataStoreFormUpdateModelWithVariableCollisions } from '../ui-components';
import { ModelWithVariableCollisions } from '../models';

const initializeTestData = async () => {
  const savedRecord = DataStore.save(new ModelWithVariableCollisions({ modelWithVariableCollisions: 'test' }));
  return savedRecord;
};

export default function DSModelWithVariableCollisions() {
  const [isInitialized, setInitialized] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [updatedFieldValue, setUpdatedFieldValue] = useState<string | null | undefined>('');
  // setting to null to prevent matching empty string in the test
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      const createdRecord = await initializeTestData();
      setRecordId(createdRecord.id);
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
      <Heading>DataStoreFormUpdateModelWithVariableCollisions</Heading>
      <View id="DataStoreFormUpdateModelWithVariableCollisions">
        <DataStoreFormUpdateModelWithVariableCollisions
          id={recordId}
          onSuccess={async () => {
            const updatedRecord = await DataStore.query(ModelWithVariableCollisions, recordId);
            setUpdatedFieldValue(updatedRecord?.modelWithVariableCollisions);
          }}
        />
        <Text>UpdatedField= {updatedFieldValue}</Text>
      </View>
    </AmplifyProvider>
  );
}
