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
import { AmplifyProvider, View, Heading, Text, Divider } from '@aws-amplify/ui-react';
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import {
  DataStoreFormUpdateCompositeDog,
  DataStoreFormCreateCompositeDog,
  DataStoreFormUpdateCompositeDogScalar,
} from '../ui-components'; // eslint-disable-line import/extensions, max-len
import {
  CompositeDog,
  CompositeOwner,
  CompositeToy,
  CompositeBowl,
  CompositeVet,
  LazyCompositeVet,
  CompositeDogCompositeVet,
  LazyCompositeDogCompositeVet,
  LazyCompositeDog,
} from '../models';
import { getModelsFromJoinTableRecords } from '../test-utils';

const initializeTestData = async (): Promise<void> => {
  await Promise.all<any>([
    DataStore.save(new CompositeOwner({ lastName: 'Cooper', firstName: 'Dale' })),
    DataStore.save(new CompositeOwner({ lastName: 'Cooper', firstName: 'Gordon' })),
    DataStore.save(new CompositeToy({ kind: 'chew', color: 'green' })),
    DataStore.save(new CompositeToy({ kind: 'chew', color: 'red' })),
    DataStore.save(new CompositeBowl({ shape: 'round', size: 'xs' })),
    DataStore.save(new CompositeBowl({ shape: 'round', size: 'xl' })),
    DataStore.save(new CompositeVet({ specialty: 'Dentistry', city: 'Seattle' })),
    DataStore.save(new CompositeVet({ specialty: 'Dentistry', city: 'Los Angeles' })),
  ]);
};

const initializeUpdate1TestData = async ({
  setDataStoreFormUpdateCompositeDogRecord,
}: {
  setDataStoreFormUpdateCompositeDogRecord: React.Dispatch<SetStateAction<CompositeDog | undefined>>;
}): Promise<void> => {
  const connectedBowl = await DataStore.query(CompositeBowl, { shape: 'round', size: 'xs' });
  const connectedOwner = await DataStore.query(CompositeOwner, { lastName: 'Cooper', firstName: 'Dale' });
  const connectedVet = await DataStore.query(CompositeVet, { specialty: 'Dentistry', city: 'Seattle' });
  const connectedToy = await DataStore.query(CompositeToy, { kind: 'chew', color: 'green' });

  const createdRecord = await DataStore.save(
    new CompositeDog({
      name: 'Yundoo',
      description: 'tiny but mighty',
      CompositeBowl: connectedBowl,
      CompositeOwner: connectedOwner,
    }),
  );

  // connect vet through join table
  if (connectedVet) {
    await DataStore.save(
      new CompositeDogCompositeVet({
        compositeDog: createdRecord,
        compositeVet: connectedVet,
      }),
    );
  }

  // connect toy
  if (connectedToy) {
    await DataStore.save(
      CompositeToy.copyOf(connectedToy, (updated) => {
        Object.assign(updated, {
          compositeDogCompositeToysName: createdRecord.name,
          compositeDogCompositeToysDescription: createdRecord.description,
        });
      }),
    );
  }

  setDataStoreFormUpdateCompositeDogRecord((prevRecord) => {
    if (!prevRecord) {
      return createdRecord;
    }
    return prevRecord;
  });
};

export default function () {
  const [dataStoreFormCreateCompositeDogResults, setDataStoreFormCreateCompositeDogResults] = useState('');
  const [dataStoreFormUpdateCompositeDogResults, setDataStoreFormUpdateCompositeDogResults] = useState('');
  const [dataStoreFormUpdateCompositeDogRecord, setDataStoreFormUpdateCompositeDogRecord] = useState<
    CompositeDog | undefined
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
      await initializeUpdate1TestData({ setDataStoreFormUpdateCompositeDogRecord });
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
      <Heading>DataStoreFormCreateCompositeDog</Heading>
      <View id="DataStoreFormCreateCompositeDog">
        <DataStoreFormCreateCompositeDog
          onSuccess={async () => {
            const record = (await DataStore.query(CompositeDog, {
              name: 'Cookie',
              description: 'mogwai',
            })) as LazyCompositeDog;

            const CompositeVets = await getModelsFromJoinTableRecords<
              CompositeDog,
              LazyCompositeVet,
              LazyCompositeDogCompositeVet
            >(record, 'CompositeVets', 'compositeVet');

            setDataStoreFormCreateCompositeDogResults(
              JSON.stringify({
                ...record,
                CompositeBowl: await record.CompositeBowl,
                CompositeOwner: await record.CompositeOwner,
                CompositeToys: await record.CompositeToys?.toArray(),
                CompositeVets,
              }),
            );
          }}
        />

        <Text>{dataStoreFormCreateCompositeDogResults}</Text>
      </View>
      <Divider />
      <Heading>DataStoreFormUpdateCompositeDog</Heading>
      <View id="DataStoreFormUpdateCompositeDog">
        <DataStoreFormUpdateCompositeDog
          compositeDog={dataStoreFormUpdateCompositeDogRecord}
          onSuccess={async () => {
            const record = (await DataStore.query(CompositeDog, {
              name: 'Yundoo',
              description: 'tiny but mighty',
            })) as LazyCompositeDog;

            const CompositeVets = await getModelsFromJoinTableRecords<
              CompositeDog,
              LazyCompositeVet,
              LazyCompositeDogCompositeVet
            >(record, 'CompositeVets', 'compositeVet');

            setDataStoreFormUpdateCompositeDogResults(
              JSON.stringify({
                ...record,
                CompositeBowl: await record.CompositeBowl,
                CompositeOwner: await record.CompositeOwner,
                CompositeToys: await record.CompositeToys?.toArray(),
                CompositeVets,
              }),
            );
          }}
        />
        <Text>{dataStoreFormUpdateCompositeDogResults}</Text>
      </View>
      <Divider />
      <Heading>DataStoreFormUpdateCompositeDogScalar</Heading>
      <View id="DataStoreFormUpdateCompositeDogScalar">
        <DataStoreFormUpdateCompositeDogScalar
          compositeDog={dataStoreFormUpdateCompositeDogRecord}
          onSuccess={async () => {
            const record = (await DataStore.query(CompositeDog, {
              name: 'Yundoo',
              description: 'tiny but mighty',
            })) as LazyCompositeDog;

            setDataStoreFormUpdateCompositeDogResults(
              JSON.stringify({
                ...record,
                CompositeBowl: await record.CompositeBowl,
                CompositeOwner: await record.CompositeOwner,
              }),
            );
          }}
        />
        <Text>{dataStoreFormUpdateCompositeDogResults}</Text>
      </View>
      <Heading>DataStoreFormUpdateCompositeDogById</Heading>
      <View id="DataStoreFormUpdateCompositeDogById">
        <DataStoreFormUpdateCompositeDog id={{ name: 'Yundoo', description: 'tiny but mighty' }} />
      </View>
    </AmplifyProvider>
  );
}
