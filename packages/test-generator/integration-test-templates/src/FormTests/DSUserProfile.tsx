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
import React, { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormCreateUserProfile, DataStoreFormUpdateUserProfile } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import { UserProfile } from '../models';

const initializeTestData = async () => {
  const existingProfile = await DataStore.save(
    new UserProfile({
      name: 'Jane Doe',
      image: 'file1.jpg',
      additionalImages: ['file2.jpg', 'file3.png'],
      headline: 'Hello World',
    }),
  );
  return { existingProfile };
};

export default function () {
  const [DataStoreCreateUserProfileRecord, setDataStoreCreateUserProfileRecord] = useState<Partial<UserProfile>>({});
  const [isInitialized, setInitialized] = useState(false);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      const { existingProfile } = await initializeTestData();
      setDataStoreCreateUserProfileRecord(existingProfile);
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
      <Heading>UserProfile</Heading>
      <View id="CreateUserProfile">
        <DataStoreFormCreateUserProfile />
      </View>
      <View id="UpdateUserProfile">
        <View id="data-preview">
          {DataStoreCreateUserProfileRecord &&
            Object.entries(DataStoreCreateUserProfileRecord).map(([prop, value]) => {
              return <Text>{`${prop}: ${JSON.stringify(value)}`}</Text>;
            })}
        </View>
        <DataStoreFormUpdateUserProfile
          id={DataStoreCreateUserProfileRecord?.id}
          onSubmit={(r) => {
            setDataStoreCreateUserProfileRecord(r);
            return r;
          }}
        />
      </View>
    </AmplifyProvider>
  );
}
