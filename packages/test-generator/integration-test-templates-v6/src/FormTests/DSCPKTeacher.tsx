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
import { ThemeProvider, View, Heading, Text, Divider } from '@aws-amplify/ui-react';
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { DataStoreFormCreateCPKTeacher, DataStoreFormUpdateCPKTeacher } from '../ui-components'; // eslint-disable-line import/extensions, max-len
import {
  CPKStudent,
  CPKClass,
  CPKProject,
  CPKTeacher,
  LazyCPKTeacherCPKClass,
  CPKTeacherCPKClass,
  LazyCPKClass,
  LazyCPKTeacher,
} from '../models';
import { getModelsFromJoinTableRecords } from '../test-utils';

const initializeTestData = async (): Promise<void> => {
  await Promise.all<any>([
    DataStore.save(new CPKStudent({ specialStudentId: 'Harry' })),
    DataStore.save(new CPKStudent({ specialStudentId: 'Hermione' })),
    DataStore.save(new CPKClass({ specialClassId: 'Math' })),
    DataStore.save(new CPKClass({ specialClassId: 'English' })),
    DataStore.save(new CPKProject({ specialProjectId: 'Either/Or' })),
    DataStore.save(new CPKProject({ specialProjectId: 'Figure 8' })),
  ]);
};

const initializeUpdate1TestData = async ({
  setDataStoreFormUpdateCPKTeacherRecordId,
}: {
  setDataStoreFormUpdateCPKTeacherRecordId: React.Dispatch<SetStateAction<string | undefined>>;
}): Promise<void> => {
  const connectedStudent = await DataStore.query(CPKStudent, 'Harry');
  const connectedClass = await DataStore.query(CPKClass, 'Math');
  const connectedProject = await DataStore.query(CPKProject, 'Figure 8');

  const createdRecord = await DataStore.save(
    new CPKTeacher({
      specialTeacherId: 'Update1ID',
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

  setDataStoreFormUpdateCPKTeacherRecordId((prevId) => {
    if (!prevId) {
      return createdRecord.specialTeacherId;
    }
    return prevId;
  });
};

export default function () {
  const [dataStoreFormCreateCPKTeacherResults, setDataStoreFormCreateCPKTeacherResults] = useState('');
  const [dataStoreFormUpdateCPKTeacherResults, setDataStoreFormUpdateCPKTeacherResults] = useState('');
  const [dataStoreFormUpdateCPKTeacherRecordId, setDataStoreFormUpdateCPKTeacherRecordId] = useState<
    string | undefined
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
      await Promise.all([initializeUpdate1TestData({ setDataStoreFormUpdateCPKTeacherRecordId })]);
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
      <Heading>DataStoreFormCreateCPKTeacher</Heading>
      <View id="DataStoreFormCreateCPKTeacher">
        <DataStoreFormCreateCPKTeacher
          onSuccess={async () => {
            const record = (await DataStore.query(CPKTeacher, 'Create1ID')) as LazyCPKTeacher;

            const CPKClasses = await getModelsFromJoinTableRecords<CPKTeacher, LazyCPKClass, LazyCPKTeacherCPKClass>(
              record,
              'CPKClasses',
              'cpkClass',
            );

            setDataStoreFormCreateCPKTeacherResults(
              JSON.stringify({
                ...record,
                CPKStudent: await record.CPKStudent,
                CPKClasses,
                CPKProjects: await record.CPKProjects?.toArray(),
              }),
            );
          }}
        />
        <Text>{dataStoreFormCreateCPKTeacherResults}</Text>
      </View>
      <Divider />
      <Heading>DataStoreFormUpdateCPKTeacher</Heading>
      <View id="DataStoreFormUpdateCPKTeacher">
        <DataStoreFormUpdateCPKTeacher
          specialTeacherId={dataStoreFormUpdateCPKTeacherRecordId}
          onSuccess={async () => {
            const record = (await DataStore.query(CPKTeacher, 'Update1ID')) as LazyCPKTeacher;

            const CPKClasses = await getModelsFromJoinTableRecords<CPKTeacher, LazyCPKClass, LazyCPKTeacherCPKClass>(
              record,
              'CPKClasses',
              'cpkClass',
            );

            setDataStoreFormUpdateCPKTeacherResults(
              JSON.stringify({
                ...record,
                CPKStudent: await record.CPKStudent,
                CPKClasses,
                CPKProjects: await record.CPKProjects?.toArray(),
              }),
            );
          }}
        />
        <Text>{dataStoreFormUpdateCPKTeacherResults}</Text>
      </View>
      <Divider />
    </ThemeProvider>
  );
}
