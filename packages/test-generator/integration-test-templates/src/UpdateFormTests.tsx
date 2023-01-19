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
import {
  DataStoreFormUpdateAllSupportedFormFields,
  DataStoreFormUpdateCompositeDog,
  DataStoreFormUpdateCPKTeacher,
  DataStoreFormUpdateCompositeToy,
} from './ui-components'; // eslint-disable-line import/extensions, max-len
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
  LazyCPKTeacherCPKClass,
  CPKTeacherCPKClass,
  LazyCPKClass,
  CompositeDog,
  CompositeOwner,
  CompositeToy,
  CompositeBowl,
  CompositeVet,
  LazyCompositeVet,
  CompositeDogCompositeVet,
  LazyCompositeDogCompositeVet,
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

    // for CompositeDog
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
      nonModelField: { StringVal: 'myValue' },
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
  const connectedStudent = await DataStore.query(CPKStudent, 'Harry');
  const connectedClass = await DataStore.query(CPKClass, 'Math');
  const connectedProject = await DataStore.query(CPKProject, 'Figure 8');

  const createdRecord = await DataStore.save(
    new CPKTeacher({
      specialTeacherId: 'mySpecialTeacherId',
      CPKStudent: connectedStudent as CPKStudent,
      cPKTeacherCPKStudentSpecialStudentId: 'Harry',
    }),
  );

  if (connectedClass) {
    await DataStore.save(
      new CPKTeacherCPKClass({
        cpkClass: connectedClass,
        cpkTeacher: createdRecord,
      }),
    );
  }

  if (connectedProject) {
    await DataStore.save(
      CPKProject.copyOf(connectedProject, (updated) => {
        Object.assign(updated, { cPKTeacherID: createdRecord.specialTeacherId });
      }),
    );
  }

  setCPKTeacherId((prevId) => {
    if (!prevId) {
      return createdRecord.specialTeacherId;
    }
    return prevId;
  });
};

const initializeCompositeDogTestData = async ({
  setCompositeDogRecord,
}: {
  setCompositeDogRecord: React.Dispatch<SetStateAction<CompositeDog | undefined>>;
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

  setCompositeDogRecord((prevRecord) => {
    if (!prevRecord) {
      return createdRecord;
    }
    return prevRecord;
  });
};

export default function UpdateFormTests() {
  const [isInitialized, setInitialized] = useState(false);
  const [allSupportedFormFieldsRecordId, setAllSupportedFormFieldsRecordId] = useState<string | undefined>(undefined);

  const [dataStoreFormUpdateAllSupportedFormFieldsRecord, setDataStoreFormUpdateAllSupportedFormFieldsRecord] =
    useState('');
  const [cpkTeacherId, setCPKTeacherId] = useState<string | undefined>('');
  const [dataStoreFormUpdateCPKTeacherRecord, setDataStoreFormUpdateCPKTeacherRecord] = useState<string>('');

  const [compositeDogRecord, setCompositeDogRecord] = useState<CompositeDog | undefined>();

  const [compositeDogRecordString, setCompositeDogRecordString] = useState<string>('');
  const initializeStarted = useRef(false);

  const [compositeToyRecord, setCompositeToyRecord] = useState<CompositeToy | undefined>();
  const [compositeToyRecordString, setCompositeToyRecordString] = useState<string>('');
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
        initializeCompositeDogTestData({ setCompositeDogRecord }),
      ]);
      setCompositeToyRecord(await DataStore.query(CompositeToy, { kind: 'chew', color: 'red' }));
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

            const ManyToManyTags = await getModelsFromJoinTableRecords<
              AllSupportedFormFields,
              LazyTag,
              LazyAllSupportedFormFieldsTag
            >(record, 'ManyToManyTags', 'tag');
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

            const CPKClasses = await getModelsFromJoinTableRecords<CPKTeacher, LazyCPKClass, LazyCPKTeacherCPKClass>(
              record,
              'CPKClasses',
              'cpkClass',
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
      <Divider />
      <Heading>DataStore Form - UpdateCompositeDog</Heading>
      <View id="dataStoreFormUpdateCompositeDog">
        <DataStoreFormUpdateCompositeDog
          compositeDog={compositeDogRecord}
          onSuccess={async () => {
            const records = await DataStore.query(CompositeDog);
            const record = records[0];

            const CompositeVets = await getModelsFromJoinTableRecords<
              CompositeDog,
              LazyCompositeVet,
              LazyCompositeDogCompositeVet
            >(record, 'CompositeVets', 'compositeVet');

            setCompositeDogRecordString(
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
        <Text>{compositeDogRecordString}</Text>
      </View>
      <Heading>DataStore Form - UpdateCompositeToy</Heading>
      <View id="dataStoreFormUpdateCompositeToy">
        <DataStoreFormUpdateCompositeToy
          compositeToy={compositeToyRecord}
          onSuccess={async () => {
            const record = await DataStore.query(CompositeToy, { kind: 'chew', color: 'red' });

            setCompositeToyRecordString(JSON.stringify(record));
          }}
        />
        <Text>{compositeToyRecordString}</Text>
      </View>
    </AmplifyProvider>
  );
}
