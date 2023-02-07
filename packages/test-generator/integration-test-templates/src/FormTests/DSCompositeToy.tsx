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
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateCompositeToy } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import { CompositeDog, CompositeToy } from '../models';

const initializeTestData = async (): Promise<void> => {
  await Promise.all<any>([DataStore.save(new CompositeDog({ name: 'Yundoo', description: 'tiny but mighty' }))]);
};

const initializeUpdate1TestData = async ({
  setDataStoreFormUpdateCompositeToyRecord,
}: {
  setDataStoreFormUpdateCompositeToyRecord: React.Dispatch<SetStateAction<CompositeToy | undefined>>;
}): Promise<void> => {
  const createdRecord = await DataStore.save(
    new CompositeToy({
      kind: 'chew',
      color: 'red',
    }),
  );

  setDataStoreFormUpdateCompositeToyRecord((prevRecord) => {
    if (!prevRecord) {
      return createdRecord;
    }
    return prevRecord;
  });
};

export default function () {
  const [dataStoreFormUpdateCompositeToyResults, setDataStoreFormUpdateCompositeToyResults] = useState('');
  const [dataStoreFormUpdateCompositeToyRecord, setDataStoreFormUpdateCompositeToyRecord] = useState<
    CompositeToy | undefined
  >();
  const [isInitialized, setInitialized] = useState(false);

  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeTestData();
      await Promise.all([initializeUpdate1TestData({ setDataStoreFormUpdateCompositeToyRecord })]);
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
      <Heading>DataStoreFormUpdateCompositeToy</Heading>
      <View id="DataStoreFormUpdateCompositeToy">
        <DataStoreFormUpdateCompositeToy
          compositeToy={dataStoreFormUpdateCompositeToyRecord}
          onSuccess={async () => {
            const record = await DataStore.query(CompositeToy, { kind: 'chew', color: 'red' });
            setDataStoreFormUpdateCompositeToyResults(JSON.stringify(record));
          }}
        />
        <Text>{dataStoreFormUpdateCompositeToyResults}</Text>
      </View>
    </AmplifyProvider>
  );
}
