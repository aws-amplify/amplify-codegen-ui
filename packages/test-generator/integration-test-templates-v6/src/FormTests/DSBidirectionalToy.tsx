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
import { DataStoreFormCreateBidirectionalDog } from '../ui-components'; // eslint-disable-line import/extensions
import { BiDirectionalDog, BiDirectionalToy } from '../models';

const toyName = 'Bone';

const initializeTestData = async (): Promise<{
  connectedDog: BiDirectionalDog;
  connectedToy: BiDirectionalToy;
}> => {
  const connectedDog = await DataStore.save(new BiDirectionalDog({ name: 'Fluffy' }));
  const connectedToy = await DataStore.save(
    new BiDirectionalToy({
      name: toyName,
      BiDirectionalDog: connectedDog,
      biDirectionalDogID: connectedDog.id,
      biDirectionalDogBiDirectionalToysId: connectedDog.id,
    }),
  );

  return { connectedDog, connectedToy };
};

export default function DSBidirectionalToy() {
  const [DogBiDirectionalToyId, setDogBiDirectionalToyId] = useState<{
    toyBiDirectionalDogIdUpdated: string;
    biDirectionalDogBiDirectionalToysIdUpdated: string | null | undefined;
  }>({ toyBiDirectionalDogIdUpdated: '', biDirectionalDogBiDirectionalToysIdUpdated: '' });
  const [isInitialized, setInitialized] = useState(false);
  // setting to null to prevent matching empty string in the test
  const [newDogId, setCreatedDogId] = useState<string | null>(null);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      const { connectedToy } = await initializeTestData();
      setDogBiDirectionalToyId({
        toyBiDirectionalDogIdUpdated: (await connectedToy.BiDirectionalDog).id,
        biDirectionalDogBiDirectionalToysIdUpdated: connectedToy.biDirectionalDogBiDirectionalToysId,
      });
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
      <Heading>DataStoreFormCreateBidirectionalDog</Heading>
      <View id="DataStoreFormCreateBidirectionalDog">
        <DataStoreFormCreateBidirectionalDog
          onSuccess={async () => {
            const results = await DataStore.query(BiDirectionalDog, (dog) => dog.name.eq('Spot'));
            const createdDogId = results.pop()?.id ?? '';
            setCreatedDogId(createdDogId);
            const stolenToy = (await DataStore.query(BiDirectionalToy, (toy) => toy.name.eq(toyName))).pop();
            if (stolenToy) {
              setDogBiDirectionalToyId({
                toyBiDirectionalDogIdUpdated: (await stolenToy.BiDirectionalDog).id,
                biDirectionalDogBiDirectionalToysIdUpdated: stolenToy.biDirectionalDogBiDirectionalToysId,
              });
            }
          }}
        />
        <Text>
          {DogBiDirectionalToyId.toyBiDirectionalDogIdUpdated === newDogId
            ? 'Toy BiDirectionalDogId is connected to new dog'
            : ''}
        </Text>
        <Text>
          {DogBiDirectionalToyId.biDirectionalDogBiDirectionalToysIdUpdated === newDogId
            ? 'Toy biDirectionalDogBiDirectionalToysId is connected to new dog'
            : ''}
        </Text>
      </View>
    </ThemeProvider>
  );
}
