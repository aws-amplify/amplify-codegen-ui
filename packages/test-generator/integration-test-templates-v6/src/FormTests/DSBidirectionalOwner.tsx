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
import { ThemeProvider, View, Heading, Text } from '@aws-amplify/ui-react';
import { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormCreateBidirectionalOwner, DataStoreFormUpdateBidirectionalOwner } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import { BiDirectionalDog, BiDirectionalOwner } from '../models';

const initializeTestData = async (): Promise<{
  connectedOwner: BiDirectionalOwner;
}> => {
  const connectedDog = await DataStore.save(new BiDirectionalDog({ name: 'Fluffy' }));
  const connectedOwner = await DataStore.save(
    new BiDirectionalOwner({
      name: 'Fluffys Owner',
      BiDirectionalDog: connectedDog,
      biDirectionalDogID: connectedDog.id,
    }),
  );
  await DataStore.save(
    BiDirectionalDog.copyOf(connectedDog, (updated) => {
      Object.assign(updated, {
        BiDirectionalOwner: connectedOwner,
      });
    }),
  );

  const connectedDog2 = await DataStore.save(new BiDirectionalDog({ name: 'Max' }));
  const connectedOwner2 = await DataStore.save(
    new BiDirectionalOwner({
      name: 'Maxs Owner',
      BiDirectionalDog: connectedDog2,
      biDirectionalDogID: connectedDog2.id,
    }),
  );
  await DataStore.save(
    BiDirectionalDog.copyOf(connectedDog2, (updated) => {
      Object.assign(updated, {
        BiDirectionalOwner: connectedOwner2,
      });
    }),
  );

  return { connectedOwner };
};

export default function () {
  const [DataStoreFormUpdateBidirectionalOwnerRecord, setDataStoreFormUpdateBidirectionalOwnerRecord] = useState<
    BiDirectionalOwner | undefined
  >();
  const [DataStoreFormCreateBidirectionalOwnerError, setDataStoreFormCreateBidirectionalOwnerError] = useState('');
  const [DataStoreFormUpdateBidirectionalOwnerError, setDataStoreFormUpdateBidirectionalOwnerError] = useState('');
  const [isInitialized, setInitialized] = useState(false);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      const { connectedOwner } = await initializeTestData();
      setDataStoreFormUpdateBidirectionalOwnerRecord(connectedOwner);

      setInitialized(true);
    };

    initializeTestState();
    initializeStarted.current = true;
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <Heading>DataStoreFormCreateBidirectionalOwner</Heading>
      <View id="DataStoreFormCreateBidirectionalOwner">
        <DataStoreFormCreateBidirectionalOwner
          onError={(fields, err) => {
            setDataStoreFormCreateBidirectionalOwnerError(err);
          }}
        />
        <Text>{DataStoreFormCreateBidirectionalOwnerError}</Text>
      </View>
      <Heading>DataStoreFormUpdateBidirectionalOwner</Heading>
      <View id="DataStoreFormUpdateBidirectionalOwner">
        <DataStoreFormUpdateBidirectionalOwner
          id={DataStoreFormUpdateBidirectionalOwnerRecord?.id}
          onError={(fields, err) => {
            setDataStoreFormUpdateBidirectionalOwnerError(err);
          }}
        />
        <Text>{DataStoreFormUpdateBidirectionalOwnerError}</Text>
      </View>
    </ThemeProvider>
  );
}
