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
import { AmplifyProvider, View, Heading, Text, Divider } from '@aws-amplify/ui-react';
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { AsyncItem, DataStore } from '@aws-amplify/datastore';
import { DataStoreFormUpdateAllSupportedFormFields, DataStoreFormUpdateCPKTeacher } from './ui-components'; // eslint-disable-line import/extensions, max-len
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
  CPKStudent,
  CPKClass,
  CPKProject,
  CPKTeacher,
  LazyCPKProject,
  LazyCPKTeacherCPKClass,
  CPKTeacherCPKClass,
  LazyCPKClass,
} from './models';
import { getModelsFromJoinTableRecords } from './test-utils';

const initializeTestData = async (): Promise<void> => {
  await Promise.all<any>([
    // for AllSupportedFormFields
    DataStore.save(new User({ firstName: 'John', lastName: 'Lennon', age: 29 })),
    DataStore.save(new User({ firstName: 'Paul', lastName: 'McCartney', age: 72 })),
    DataStore.save(new User({ firstName: 'George', lastName: 'Harrison', age: 50 })),
    DataStore.save(new User({ firstName: 'Ringo', lastName: 'Starr', age: 5 })),
    DataStore.save(new Owner({ name: 'John' })),
    DataStore.save(new Owner({ name: 'Paul' })),
    DataStore.save(new Owner({ name: 'George' })),
    DataStore.save(new Owner({ name: 'Ringo' })),
    DataStore.save(new Tag({ label: 'Red' })),
    DataStore.save(new Tag({ label: 'Blue' })),
    DataStore.save(new Tag({ label: 'Green' })),
    DataStore.save(new Tag({ label: 'Orange' })),
    DataStore.save(new Student({ name: 'Matthew' })),
    DataStore.save(new Student({ name: 'Sarah' })),
    DataStore.save(new Student({ name: 'David' })),
    DataStore.save(new Student({ name: 'Jessica' })),

    // for CPKTeacher
    DataStore.save(new CPKStudent({ specialStudentId: 'Harry' })),
    DataStore.save(new CPKStudent({ specialStudentId: 'Hermione' })),
    DataStore.save(new CPKClass({ specialClassId: 'Math' })),
    DataStore.save(new CPKClass({ specialClassId: 'English' })),
    DataStore.save(new CPKProject({ specialProjectId: 'Either/Or' })),
    DataStore.save(new CPKProject({ specialProjectId: 'Figure 8' })),
  ]);
};

const initializeAllSupportedFormFieldsTestData = async ({
  setAllSupportedFormFieldsRecordId,
}: {
  setAllSupportedFormFieldsRecordId: React.Dispatch<SetStateAction<string | undefined>>;
}): Promise<void> => {
  const connectedUser = (await DataStore.query(User, (u) => u.firstName.eq('John')))[0];
  const connectedOwner = (await DataStore.query(Owner, (owner) => owner.name.eq('John')))[0];
  const connectedTags = await DataStore.query(Tag, (tag) => tag.or((t) => [t.label.eq('Red'), t.label.eq('Blue')]));
  const connectedStudents = await DataStore.query(Student, (student) =>
    student.or((s) => [s.name.eq('David'), s.name.eq('Jessica')]),
  );
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

  setAllSupportedFormFieldsRecordId((prevId) => {
    if (!prevId) {
      return createdRecord.id;
    }
    return prevId;
  });
};

const initializeCPKTeacherTestData = async ({
  setCPKTeacherId,
}: {
  setCPKTeacherId: React.Dispatch<SetStateAction<string | undefined>>;
}): Promise<void> => {
  const connectedStudent = (await DataStore.query(CPKStudent, (s) => s.specialStudentId.eq('Harry')))[0];
  const connectedClasses = await DataStore.query(CPKClass, (c) => c.specialClassId.eq('Math'));
  const connectedProjects = await DataStore.query(CPKProject, (p) => p.specialProjectId.eq('Figure 8'));

  const createdRecord = await DataStore.save(
    new CPKTeacher({
      specialTeacherId: 'mySpecialTeacherId',
      CPKStudent: connectedStudent,
    }),
  );

  await Promise.all(
    connectedClasses.reduce((promises: AsyncItem<LazyCPKTeacherCPKClass>[], cpkClass) => {
      promises.push(
        DataStore.save(
          new CPKTeacherCPKClass({
            cpkClass,
            cpkTeacher: createdRecord,
          }),
        ),
      );
      return promises;
    }, []),
  );

  await Promise.all(
    connectedProjects.reduce((promises: AsyncItem<LazyCPKProject>[], project) => {
      promises.push(
        DataStore.save(
          CPKProject.copyOf(project, (updated) => {
            Object.assign(updated, { cPKTeacherID: createdRecord.specialTeacherId });
          }),
        ),
      );
      return promises;
    }, []),
  );

  setCPKTeacherId((prevId) => {
    if (!prevId) {
      return createdRecord.specialTeacherId;
    }
    return prevId;
  });
};

export default function UpdateFormTests() {
  const [isInitialized, setInitialized] = useState(false);
  const [allSupportedFormFieldsRecordId, setAllSupportedFormFieldsRecordId] = useState<string | undefined>(undefined);

  const [dataStoreFormUpdateAllSupportedFormFieldsRecord, setDataStoreFormUpdateAllSupportedFormFieldsRecord] =
    useState('');
  const [cpkTeacherId, setCPKTeacherId] = useState<string | undefined>('');
  const [dataStoreFormUpdateCPKTeacherRecord, setDataStoreFormUpdateCPKTeacherRecord] = useState<string>('');

  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeTestData();
      await Promise.all([
        initializeAllSupportedFormFieldsTestData({ setAllSupportedFormFieldsRecordId }),
        initializeCPKTeacherTestData({ setCPKTeacherId }),
      ]);
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
      <Divider />
      <Heading>DataStore Form - UpdateCPKTeacher</Heading>
      <View id="dataStoreFormUpdateCPKTeacher">
        <DataStoreFormUpdateCPKTeacher
          specialTeacherId={cpkTeacherId}
          onSuccess={async () => {
            const records = await DataStore.query(CPKTeacher);
            const record = records[0];

            const joinTableRecords = (await record.CPKClasses?.toArray()) as LazyCPKTeacherCPKClass[];

            const CPKClasses = await Promise.all(
              joinTableRecords?.reduce((promises: AsyncItem<LazyCPKClass>[], joinTableRecord) => {
                promises.push(joinTableRecord.cpkClass as AsyncItem<LazyCPKClass>);
                return promises;
              }, []),
            );

            setDataStoreFormUpdateCPKTeacherRecord(
              JSON.stringify({
                ...record,
                CPKStudent: await record.CPKStudent,
                CPKClasses,
                CPKProjects: await record.CPKProjects?.toArray(),
              }),
            );
          }}
        />
        <Text>{dataStoreFormUpdateCPKTeacherRecord}</Text>
      </View>
    </AmplifyProvider>
  );
}
