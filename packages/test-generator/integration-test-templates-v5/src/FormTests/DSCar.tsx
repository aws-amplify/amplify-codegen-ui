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
import { AmplifyProvider, View, Heading, Text } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateCar } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import { Car, Dealership } from '../models';

const dataStoreFormUpdateCarName = 'Honda';
const dataStoreFormUpdateCarPrevDealership = 'Oceans Fullerton';

const initializeTestData = async ({
  setDataStoreFormUpdateCarRecord,
}: {
  setDataStoreFormUpdateCarRecord: React.Dispatch<SetStateAction<Car | undefined>>;
}): Promise<void> => {
  let car = await DataStore.save(new Car({ name: dataStoreFormUpdateCarName }));
  const [connectedDealership] = await Promise.all([
    DataStore.save(new Dealership({ name: dataStoreFormUpdateCarPrevDealership })),
    DataStore.save(new Dealership({ name: 'Tustin Toyota' })),
    DataStore.save(new Dealership({ name: 'Chapman Ford' })),
  ]);
  car = await DataStore.save(
    Car.copyOf(car, (c) => {
      Object.assign(c, { dealership: connectedDealership });
    }),
  );
  setDataStoreFormUpdateCarRecord(car);
};

export default function () {
  const [dataStoreFormUpdateCarResults, setDataStoreFormUpdateCarResults] = useState('');
  const [dataStoreFormUpdateCarRecord, setDataStoreFormUpdateCarRecord] = useState<Car | undefined>();
  const [isInitialized, setInitialized] = useState(false);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeTestData({ setDataStoreFormUpdateCarRecord });
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
      <Heading>DataStoreFormUpdateCar</Heading>
      <View id="DataStoreFormUpdateCar">
        <DataStoreFormUpdateCar
          car={dataStoreFormUpdateCarRecord}
          onSuccess={async () => {
            const record = (await DataStore.query(Car, (c) => c.name.eq(dataStoreFormUpdateCarName)))[0];
            const newDealershipCars = await (await record.dealership)?.cars.toArray();
            const prevDealershipCars = await (
              await DataStore.query(Dealership, (c) => c.name.eq(dataStoreFormUpdateCarPrevDealership))
            )[0]?.cars.toArray();
            setDataStoreFormUpdateCarResults(
              JSON.stringify({
                ...record,
                dealership: await record.dealership,
                newDealershipHasCar: newDealershipCars?.some((c) => c.id === record.id),
                prevDealershipDoesNotHaveCar: !prevDealershipCars?.some((c) => c.id === record.id),
              }),
            );
          }}
        />
        <Text className="results">{dataStoreFormUpdateCarResults}</Text>
      </View>
    </AmplifyProvider>
  );
}
