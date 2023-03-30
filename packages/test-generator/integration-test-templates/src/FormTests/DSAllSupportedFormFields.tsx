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
import { AsyncItem, DataStore } from '@aws-amplify/datastore';
import {
  DataStoreFormCreateAllSupportedFormFields,
  DataStoreFormUpdateAllSupportedFormFields,
  DataStoreFormCreateAllSupportedFormFieldsScalar,
} from '../ui-components'; // eslint-disable-line import/extensions
import {
  Owner,
  User,
  Tag,
  Student,
  LazyTag,
  AllSupportedFormFields,
  AllSupportedFormFieldsTag,
  LazyAllSupportedFormFieldsTag,
  LazyStudent,
} from '../models';
import { getModelsFromJoinTableRecords } from '../test-utils';

const initializeTestData = async (): Promise<void> => {
  await Promise.all<any>([
    DataStore.save(new User({ firstName: 'John', lastName: 'Lennon', age: 29 })),
    DataStore.save(new User({ firstName: 'Paul', lastName: 'McCartney', age: 72 })),
    DataStore.save(new User({ firstName: 'George', lastName: 'Harrison', age: 50 })),
    DataStore.save(new User({ firstName: 'Ringo', lastName: 'Starr', age: 5 })),
    DataStore.save(new Owner({ name: 'John' })),
    DataStore.save(new Owner({ name: 'Paul' })),
    DataStore.save(new Owner({ name: 'George' })),
    DataStore.save(new Owner({ name: 'Ringo' })),
    DataStore.save(new Student({ name: 'David' })),
    DataStore.save(new Student({ name: 'Taylor' })),
    DataStore.save(new Student({ name: 'Michael' })),
    DataStore.save(new Student({ name: 'Sarah' })),
    DataStore.save(new Student({ name: 'Matthew' })),
    DataStore.save(new Student({ name: 'Jessica' })),
    DataStore.save(new Tag({ label: 'Red' })),
    DataStore.save(new Tag({ label: 'Blue' })),
    DataStore.save(new Tag({ label: 'Green' })),
    DataStore.save(new Tag({ label: 'Orange' })),
  ]);
};

const initializeUpdate1TestData = async ({
  setDataStoreFormUpdateAllSupportedFormFieldsRecordId,
}: {
  setDataStoreFormUpdateAllSupportedFormFieldsRecordId: React.Dispatch<SetStateAction<string | undefined>>;
}): Promise<void> => {
  const connectedUser = (await DataStore.query(User, (u) => u.firstName.eq('John')))[0];
  const connectedOwner = (await DataStore.query(Owner, (owner) => owner.name.eq('John')))[0];
  const connectedTags = await DataStore.query(Tag, (tag) => tag.or((t) => [t.label.eq('Red'), t.label.eq('Blue')]));
  const connectedStudents = await DataStore.query(Student, (student) =>
    student.or((s) => [s.name.eq('David'), s.name.eq('Jessica')]),
  );
  const createdRecord = await DataStore.save(
    new AllSupportedFormFields({
      string: 'Update1String',
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
      nonModelField: { StringVal: 'myValue' },
      nonModelFieldArray: [{ NumVal: 123 }],
      awsPhone: '713 343 5938',
      enum: 'NEW_YORK',
      HasOneUser: connectedUser,
      BelongsToOwner: connectedOwner,
    }),
  );

  // connect tags through join table
  await Promise.all(
    connectedTags.reduce((promises: AsyncItem<LazyAllSupportedFormFieldsTag>[], tag) => {
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

  // connect students to form
  await Promise.all(
    connectedStudents.reduce((promises: AsyncItem<LazyStudent>[], student) => {
      promises.push(
        DataStore.save(
          Student.copyOf(student, (updated) => {
            Object.assign(updated, { allSupportedFormFieldsID: createdRecord.id });
          }),
        ),
      );
      return promises;
    }, []),
  );

  setDataStoreFormUpdateAllSupportedFormFieldsRecordId((prevId) => {
    if (!prevId) {
      return createdRecord.id;
    }
    return prevId;
  });
};

export default function () {
  const [dataStoreFormCreateAllSupportedFormFieldsResults, setDataStoreFormCreateAllSupportedFormFieldsResults] =
    useState('');
  const [dataStoreFormUpdateAllSupportedFormFieldsResults, setDataStoreFormUpdateAllSupportedFormFieldsResults] =
    useState('');
  const [dataStoreFormUpdateAllSupportedFormFieldsRecordId, setDataStoreFormUpdateAllSupportedFormFieldsRecordId] =
    useState<string | undefined>();
  const [
    dataStoreFormCreateAllSupportedFormFieldsScalarResults,
    setDataStoreFormCreateAllSupportedFormFieldsScalarResults,
  ] = useState('');
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
      await Promise.all([initializeUpdate1TestData({ setDataStoreFormUpdateAllSupportedFormFieldsRecordId })]);
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
      <Heading>DataStoreFormCreateAllSupportedFormFields</Heading>
      <View id="DataStoreFormCreateAllSupportedFormFields">
        <DataStoreFormCreateAllSupportedFormFields
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields, (a) => a.string.eq('Create1String'));
            const record = records[0];

            const ManyToManyTags = await getModelsFromJoinTableRecords<
              AllSupportedFormFields,
              LazyTag,
              LazyAllSupportedFormFieldsTag
            >(record, 'ManyToManyTags', 'tag');
            ManyToManyTags.sort((a, b) => a.label?.localeCompare(b.label as string) as number);

            setDataStoreFormCreateAllSupportedFormFieldsResults(
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
        <Text>{dataStoreFormCreateAllSupportedFormFieldsResults}</Text>
      </View>
      <Divider />
      <Heading>DataStoreFormUpdateAllSupportedFormFields</Heading>
      <View id="DataStoreFormUpdateAllSupportedFormFields">
        <DataStoreFormUpdateAllSupportedFormFields
          id={dataStoreFormUpdateAllSupportedFormFieldsRecordId}
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields, (a) => a.string.contains('Update1String'));
            const record = records[0];

            const ManyToManyTags = await getModelsFromJoinTableRecords<
              AllSupportedFormFields,
              LazyTag,
              LazyAllSupportedFormFieldsTag
            >(record, 'ManyToManyTags', 'tag');
            ManyToManyTags.sort((a, b) => a.label?.localeCompare(b.label as string) as number);

            setDataStoreFormUpdateAllSupportedFormFieldsResults(
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
        <Text>{dataStoreFormUpdateAllSupportedFormFieldsResults}</Text>
      </View>
      <Divider />
      <Heading>DataStoreFormCreateAllSupportedFormFieldsScalar</Heading>
      <View id="DataStoreFormCreateAllSupportedFormFieldsScalar">
        <DataStoreFormCreateAllSupportedFormFieldsScalar
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields, (a) => a.string.eq('Create1String'));
            const record = records[0];

            const ManyToManyTags = await getModelsFromJoinTableRecords<
              AllSupportedFormFields,
              LazyTag,
              LazyAllSupportedFormFieldsTag
            >(record, 'ManyToManyTags', 'tag');
            ManyToManyTags.sort((a, b) => a.label?.localeCompare(b.label as string) as number);

            setDataStoreFormCreateAllSupportedFormFieldsScalarResults(
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
        <Text>{dataStoreFormCreateAllSupportedFormFieldsScalarResults}</Text>
      </View>
      <Divider />
    </AmplifyProvider>
  );
}
