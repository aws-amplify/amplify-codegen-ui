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
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { AsyncItem, DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateAllSupportedFormFields } from './ui-components'; // eslint-disable-line import/extensions, max-len
import {
  Owner,
  User,
  Tag,
  Student,
  LazyTag,
  AllSupportedFormFields,
  AllSupportedFormFieldsTag,
  LazyAllSupportedFormFieldsTag,
} from './models';
import { getModelsFromJoinTableRecords } from './test-utils';

const initializeTestData = async (): Promise<void> => {
  await DataStore.save(new User({ firstName: 'John', lastName: 'Lennon', age: 29 }));
  await DataStore.save(new User({ firstName: 'Paul', lastName: 'McCartney', age: 72 }));
  await DataStore.save(new User({ firstName: 'George', lastName: 'Harrison', age: 50 }));
  await DataStore.save(new User({ firstName: 'Ringo', lastName: 'Starr', age: 5 }));
  await DataStore.save(new Owner({ name: 'John' }));
  await DataStore.save(new Owner({ name: 'Paul' }));
  await DataStore.save(new Owner({ name: 'George' }));
  await DataStore.save(new Owner({ name: 'Ringo' }));
  await DataStore.save(new Tag({ label: 'Red' }));
  await DataStore.save(new Tag({ label: 'Blue' }));
  await DataStore.save(new Tag({ label: 'Green' }));
  await DataStore.save(new Tag({ label: 'Orange' }));
  await DataStore.save(new Student({ name: 'Matthew' }));
  await DataStore.save(new Student({ name: 'Sarah' }));
};

const initializeAllSupportedFormFieldsTestData = async ({
  setAllSupportedFormFieldsRecordId,
}: {
  setAllSupportedFormFieldsRecordId: React.Dispatch<SetStateAction<string | undefined>>;
}): Promise<void> => {
  const connectedUser = (await DataStore.query(User, (u) => u.firstName.eq('John')))[0];
  const connectedOwner = (await DataStore.query(Owner, (owner) => owner.name.eq('John')))[0];
  const connectedTags = await DataStore.query(Tag, (tag) => tag.or((t) => [t.label.eq('Red'), t.label.eq('Blue')]));
  const createdRecord = await DataStore.save(
    new AllSupportedFormFields({
      string: 'My string',
      stringArray: ['String1'],
      int: 10,
      float: 4.3,
      awsDate: '2022-11-22',
      awsTime: '10:20:30.111',
      awsDateTime: '2022-11-22T10:20:30.111Z',
      awsTimestamp: 100000000,
      awsEmail: 'myemail@amazon.com',
      awsUrl: 'https://www.amazon.com',
      awsIPAddress: '123.12.34.56',
      boolean: true,
      awsJson: JSON.stringify({ myKey: 'myValue' }),
      nonModelField: JSON.stringify({ StringVal: 'myValue' }),
      awsPhone: '713 343 5938',
      enum: 'NEW_YORK',
      HasOneUser: connectedUser,
      BelongsToOwner: connectedOwner,
    }),
  );

  await DataStore.save(new Student({ name: 'David', allSupportedFormFieldsID: createdRecord.id }));
  await DataStore.save(new Student({ name: 'Jessica', allSupportedFormFieldsID: createdRecord.id }));

  // connect tags through join table
  await Promise.all(
    connectedTags.reduce((promises: AsyncItem<LazyTag>[], tag) => {
      promises.push(
        DataStore.save(
          new AllSupportedFormFieldsTag({
            allSupportedFormFields: createdRecord,
            tag,
          }),
        ),
      );
      return promises;
    }, []),
  );

  setAllSupportedFormFieldsRecordId((prevId) => {
    if (!prevId) {
      return createdRecord.id;
    }
    return prevId;
  });
};

export default function UpdateFormTests() {
  const [isInitialized, setInitialized] = useState(false);
  const [allSupportedFormFieldsRecordId, setAllSupportedFormFieldsRecordId] = useState<string | undefined>(undefined);

  const [dataStoreFormUpdateAllSupportedFormFieldsRecord, setDataStoreFormUpdateAllSupportedFormFieldsRecord] =
    useState('');
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeTestData();
      await initializeAllSupportedFormFieldsTestData({ setAllSupportedFormFieldsRecordId });

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
        <DataStoreFormUpdateAllSupportedFormFields
          id={allSupportedFormFieldsRecordId}
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields);
            const record = records[0];

            const ManyToManyTags = await getModelsFromJoinTableRecords<LazyTag, LazyAllSupportedFormFieldsTag>(
              record,
              'ManyToManyTags',
              'tag',
            );
            ManyToManyTags.sort((a, b) => a.label?.localeCompare(b.label as string) as number);

            setDataStoreFormUpdateAllSupportedFormFieldsRecord(
              JSON.stringify({
                ...record,
                HasOneUser: await record.HasOneUser,
                BelongsToOwner: await record.BelongsToOwner,
                HasManyStudents: await record.HasManyStudents?.toArray(),
                ManyToManyTags,
              }),
            );
          }}
        />
        <Text>{dataStoreFormUpdateAllSupportedFormFieldsRecord}</Text>
      </View>
    </AmplifyProvider>
  );
}
