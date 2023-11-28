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
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { ThemeProvider, View, Heading, Text } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateDealership } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import { Car, Dealership } from '../models';

const dataStoreFormUpdateDealershipName = 'Oceans Fullerton';
const dataStoreFormUpdateDealershipPrevCarName = 'Honda';

const initializeTestData = async ({
  setDataStoreFormUpdateDealershipRecord,
}: {
  setDataStoreFormUpdateDealershipRecord: React.Dispatch<SetStateAction<Dealership | undefined>>;
}): Promise<void> => {
  const dealership = await DataStore.save(new Dealership({ name: dataStoreFormUpdateDealershipName }));

  await Promise.all([
    DataStore.save(new Car({ name: dataStoreFormUpdateDealershipPrevCarName, dealership })),
    DataStore.save(new Car({ name: 'Toyota' })),
    DataStore.save(new Car({ name: 'Ford' })),
  ]);

  setDataStoreFormUpdateDealershipRecord(dealership);
};

export default function () {
  const [dataStoreFormUpdateDealershipResults, setDataStoreFormUpdateDealershipResults] = useState('');
  const [dataStoreFormUpdateDealershipRecord, setDataStoreFormUpdateDealershipRecord] = useState<
    Dealership | undefined
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
      await initializeTestData({ setDataStoreFormUpdateDealershipRecord });
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
      <Heading>DataStoreFormUpdateDealership</Heading>
      <View id="DataStoreFormUpdateDealership">
        <DataStoreFormUpdateDealership
          dealership={dataStoreFormUpdateDealershipRecord}
          onSuccess={async () => {
            const record = (await DataStore.query(Dealership, (d) => d.name.eq(dataStoreFormUpdateDealershipName)))[0];
            const recordCars = await record.cars?.toArray();
            const prevCar = (await DataStore.query(Car, (c) => c.name.eq(dataStoreFormUpdateDealershipPrevCarName)))[0];
            setDataStoreFormUpdateDealershipResults(
              JSON.stringify({
                ...record,
                cars: recordCars,
                newCarBelongsToDealership: recordCars[0].dealershipId === record.id,
                prevCarDoesNotBelongToDealership: prevCar.dealershipId !== record.id,
              }),
            );
          }}
        />
        <Text className="results">{dataStoreFormUpdateDealershipResults}</Text>
      </View>
    </ThemeProvider>
  );
}
