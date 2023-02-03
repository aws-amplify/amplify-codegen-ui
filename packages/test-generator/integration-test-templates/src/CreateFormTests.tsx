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
import { AmplifyProvider, View, Heading, Divider, Text } from '@aws-amplify/ui-react';
import { useState, useEffect, useRef } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import {
  CustomFormCreateDog,
  DataStoreFormCreateAllSupportedFormFields,
  CustomFormCreateNestedJson,
  DataStoreFormCreateCPKTeacher,
  DataStoreFormCreateCompositeDog,
} from './ui-components'; // eslint-disable-line import/extensions, max-len

import {
  AllSupportedFormFields,
  Owner,
  User,
  Tag,
  LazyTag,
  Student,
  LazyAllSupportedFormFieldsTag,
  CPKStudent,
  CPKClass,
  CPKProject,
  CPKTeacher,
  LazyCPKTeacherCPKClass,
  LazyCPKClass,
  CompositeDog,
  CompositeOwner,
  CompositeToy,
  CompositeBowl,
  CompositeVet,
  LazyCompositeVet,
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
    DataStore.save(new Student({ name: 'David' })),
    DataStore.save(new Student({ name: 'Taylor' })),
    DataStore.save(new Student({ name: 'Michael' })),
    DataStore.save(new Student({ name: 'Sarah' })),
    DataStore.save(new Tag({ label: 'Red' })),
    DataStore.save(new Tag({ label: 'Blue' })),
    DataStore.save(new Tag({ label: 'Green' })),
    DataStore.save(new Tag({ label: 'Orange' })),

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

export default function CreateFormTests() {
  const [customFormCreateDogSubmitResults, setCustomFormCreateDogSubmitResults] = useState<any>({});

  const [isInitialized, setInitialized] = useState(false);
  const [dataStoreFormCreateAllSupportedFormFieldsRecord, setDataStoreFormCreateAllSupportedFormFieldsRecord] =
    useState('');
  const [cpkTeacherRecordString, setCPKTeacherRecordString] = useState('');
  const [compositeDogRecordString, setCompositeDogRecordString] = useState('');

  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeTestData();
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
      <Heading>Custom Form - CreateDog</Heading>
      <View id="customFormCreateDog">
        <CustomFormCreateDog
          onSubmit={(r) => setCustomFormCreateDogSubmitResults(r)}
          onValidate={{
            email: (value, validationResponse) => {
              if (validationResponse.hasError) {
                return validationResponse;
              }
              if (!value?.includes('yahoo.com')) {
                return { hasError: true, errorMessage: 'All dog emails are yahoo emails' };
              }
              return { hasError: false };
            },
          }}
        />
        <View>{`submitted: ${!!Object.keys(customFormCreateDogSubmitResults).length}`}</View>
        <View>{`name: ${customFormCreateDogSubmitResults.name}`}</View>
        <Text>{`name: ${customFormCreateDogSubmitResults.name}`}</Text>
        <Text>{`age: ${customFormCreateDogSubmitResults.age}`}</Text>
        <Text>{`email: ${customFormCreateDogSubmitResults.email}`}</Text>
        <Text>{`ip: ${customFormCreateDogSubmitResults.ip}`}</Text>
      </View>
      <Divider />
      <Heading>DataStore Form - CreateAllSupportedFormFields</Heading>
      <View id="dataStoreFormCreateAllSupportedFormFields">
        <DataStoreFormCreateAllSupportedFormFields
          onSuccess={async () => {
            const records = await DataStore.query(AllSupportedFormFields);
            const record = records[0];

            const ManyToManyTags = await getModelsFromJoinTableRecords<
              AllSupportedFormFields,
              LazyTag,
              LazyAllSupportedFormFieldsTag
            >(record, 'ManyToManyTags', 'tag');
            ManyToManyTags.sort((a, b) => a.label?.localeCompare(b.label as string) as number);

            setDataStoreFormCreateAllSupportedFormFieldsRecord(
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
        <Text>{dataStoreFormCreateAllSupportedFormFieldsRecord}</Text>
      </View>
      <Divider />
      <Heading>Custom Form - CreateNestedJson</Heading>
      <View id="customFormCreateNestedJson">
        <CustomFormCreateNestedJson onSubmit={() => undefined} />
      </View>
      <Divider />
      <Heading>DataStore Form - CreateCPKTeacher</Heading>
      <View id="dataStoreFormCreateCPKTeacher">
        <DataStoreFormCreateCPKTeacher
          onSuccess={async () => {
            const records = await DataStore.query(CPKTeacher);
            const record = records[0];

            const CPKClasses = await getModelsFromJoinTableRecords<CPKTeacher, LazyCPKClass, LazyCPKTeacherCPKClass>(
              record,
              'CPKClasses',
              'cpkClass',
            );

            setCPKTeacherRecordString(
              JSON.stringify({
                ...record,
                CPKStudent: await record.CPKStudent,
                CPKClasses,
                CPKProjects: await record.CPKProjects?.toArray(),
              }),
            );
          }}
        />
        <Text id="cpkTeacherRecord">{cpkTeacherRecordString}</Text>
      </View>
      <Divider />
      <Heading>DataStore Form - CreateCompositeDog</Heading>
      <View id="dataStoreFormCreateCompositeDog">
        <DataStoreFormCreateCompositeDog
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
        <Text id="cpkDogRecord">{compositeDogRecordString}</Text>
      </View>
    </AmplifyProvider>
  );
}
