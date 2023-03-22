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
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const City = {
  SAN_FRANCISCO: 'SAN_FRANCISCO',
  NEW_YORK: 'NEW_YORK',
  HOUSTON: 'HOUSTON',
  AUSTIN: 'AUSTIN',
  LOS_ANGELES: 'LOS_ANGELES',
  CHICAGO: 'CHICAGO',
  SAN_DIEGO: 'SAN_DIEGO',
  NEW_HAVEN: 'NEW_HAVEN',
  PORTLAND: 'PORTLAND',
  SEATTLE: 'SEATTLE',
};

const {
  UserPreference,
  User,
  Listing,
  ComplexModel,
  Class,
  Tag,
  AllSupportedFormFields,
  Owner,
  Student,
  CPKStudent,
  CPKTeacher,
  CPKClass,
  CPKProject,
  CompositeDog,
  CompositeBowl,
  CompositeOwner,
  CompositeToy,
  CompositeVet,
  BiDirectionalDog,
  BiDirectionalOwner,
  BiDirectionalToy,
  ModelWithVariableCollisions,
  Dealership,
  Car,
  AllSupportedFormFieldsTag,
  CPKTeacherCPKClass,
  CompositeDogCompositeVet,
  CustomType,
} = initSchema(schema);

export {
  UserPreference,
  User,
  Listing,
  ComplexModel,
  Class,
  Tag,
  AllSupportedFormFields,
  Owner,
  Student,
  CPKStudent,
  CPKTeacher,
  CPKClass,
  CPKProject,
  CompositeDog,
  CompositeBowl,
  CompositeOwner,
  CompositeToy,
  CompositeVet,
  BiDirectionalDog,
  BiDirectionalOwner,
  BiDirectionalToy,
  ModelWithVariableCollisions,
  Dealership,
  Car,
  AllSupportedFormFieldsTag,
  CPKTeacherCPKClass,
  CompositeDogCompositeVet,
  City,
  CustomType,
};
