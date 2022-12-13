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
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-redeclare */
import {
  ModelInit,
  MutableModel,
  LazyLoading,
  LazyLoadingDisabled,
  AsyncItem,
  AsyncCollection,
  __modelMeta__,
  CustomIdentifier,
  ManagedIdentifier,
} from '@aws-amplify/datastore';

export enum City {
  SAN_FRANCISCO = 'SAN_FRANCISCO',
  NEW_YORK = 'NEW_YORK',
  HOUSTON = 'HOUSTON',
  AUSTIN = 'AUSTIN',
  LOS_ANGELES = 'LOS_ANGELES',
  CHICAGO = 'CHICAGO',
  SAN_DIEGO = 'SAN_DIEGO',
  NEW_HAVEN = 'NEW_HAVEN',
  PORTLAND = 'PORTLAND',
  SEATTLE = 'SEATTLE',
}

type UserPreferenceMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ListingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ComplexModelMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ClassMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type TagMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type AllSupportedFormFieldsTagMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type OwnerMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type StudentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type AllSupportedFormFieldsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

export declare class UserPreference {
  readonly id: string;

  readonly favoriteColor?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
  constructor(init: ModelInit<UserPreference, UserPreferenceMetaData>);
  static copyOf(
    source: UserPreference,
    mutator: (
      draft: MutableModel<UserPreference, UserPreferenceMetaData>,
    ) => MutableModel<UserPreference, UserPreferenceMetaData> | void,
  ): UserPreference;
}

type EagerUser = {
  readonly id: string;

  readonly firstName?: string;

  readonly lastName?: string;

  readonly age?: number;

  readonly isLoggedIn?: boolean;

  readonly loggedInColor?: string;

  readonly loggedOutColor?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
};

type LazyUser = {
  readonly id: string;

  readonly firstName?: string;

  readonly lastName?: string;

  readonly age?: number;

  readonly isLoggedIn?: boolean;

  readonly loggedInColor?: string;

  readonly loggedOutColor?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
};

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser;

export declare const User: (new (init: ModelInit<User, UserMetaData>) => User) & {
  copyOf(
    source: User,
    mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void,
  ): User;
};

export declare class Listing {
  readonly id: string;

  readonly title?: string;

  readonly priceUSD?: number;

  readonly description?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
  constructor(init: ModelInit<Listing, ListingMetaData>);
  static copyOf(
    source: Listing,
    mutator: (draft: MutableModel<Listing, ListingMetaData>) => MutableModel<Listing, ListingMetaData> | void,
  ): Listing;
}

export declare class CustomType {
  readonly StringVal?: string;

  readonly NumVal?: number;

  readonly BoolVal?: boolean;

  constructor(init: ModelInit<CustomType>);
}

export declare class ComplexModel {
  readonly id: string;

  readonly listElement: string[];

  readonly myCustomField?: CustomType;

  readonly createdAt?: string;

  readonly updatedAt?: string;

  constructor(init: ModelInit<ComplexModel, ComplexModelMetaData>);

  static copyOf(
    source: ComplexModel,
    mutator: (
      draft: MutableModel<ComplexModel, ComplexModelMetaData>,
    ) => MutableModel<ComplexModel, ComplexModelMetaData> | void,
  ): ComplexModel;
}

export declare class Class {
  readonly id: string;

  readonly name?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;

  constructor(init: ModelInit<Class, ClassMetaData>);
  static copyOf(
    source: Class,
    mutator: (draft: MutableModel<Class, ClassMetaData>) => MutableModel<Class, ClassMetaData> | void,
  ): Class;
}

type EagerTag = {
  readonly id: string;

  readonly label?: string | null;

  readonly AllSupportedFormFields?: (AllSupportedFormFieldsTag | null)[] | null;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;
};

type LazyTag = {
  readonly id: string;

  readonly label?: string | null;

  readonly AllSupportedFormFields?: AsyncCollection<AllSupportedFormFieldsTag>;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;
};

export declare type Tag = LazyLoading extends LazyLoadingDisabled ? EagerTag : LazyTag;

export declare const Tag: (new (init: ModelInit<Tag, TagMetaData>) => Tag) & {
  copyOf(source: Tag, mutator: (draft: MutableModel<Tag, TagMetaData>) => MutableModel<Tag, TagMetaData> | void): Tag;
};

type EagerAllSupportedFormFieldsTag = {
  readonly id: string;

  readonly tag?: Tag;

  readonly allSupportedFormFields?: AllSupportedFormFields | null;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;
};

type LazyAllSupportedFormFieldsTag = {
  readonly id: string;

  readonly tag?: AsyncItem<Tag>;

  readonly allSupportedFormFields?: AsyncItem<AllSupportedFormFields>;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;
};

export declare type AllSupportedFormFieldsTag = LazyLoading extends LazyLoadingDisabled
  ? EagerAllSupportedFormFieldsTag
  : LazyAllSupportedFormFieldsTag;

export declare const AllSupportedFormFieldsTag: (new (
  init: ModelInit<AllSupportedFormFieldsTag, AllSupportedFormFieldsTagMetaData>,
) => AllSupportedFormFieldsTag) & {
  copyOf(
    source: AllSupportedFormFieldsTag,
    mutator: (
      draft: MutableModel<AllSupportedFormFieldsTag, AllSupportedFormFieldsTagMetaData>,
    ) => MutableModel<AllSupportedFormFieldsTag, AllSupportedFormFieldsTagMetaData> | void,
  ): AllSupportedFormFieldsTag;
};

type EagerOwner = {
  readonly id: string;

  readonly name?: string;

  readonly AllSupportedFormFields?: AllSupportedFormFields | null;

  readonly ownerAllSupportedFormFieldsId?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
};

type LazyOwner = {
  readonly id: string;

  readonly name?: string;

  readonly AllSupportedFormFields?: AsyncItem<AllSupportedFormFields | undefined>;

  readonly ownerAllSupportedFormFieldsId?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
};

export declare type Owner = LazyLoading extends LazyLoadingDisabled ? EagerOwner : LazyOwner;

export declare const Owner: (new (init: ModelInit<Owner, OwnerMetaData>) => Owner) & {
  copyOf(
    source: Owner,
    mutator: (draft: MutableModel<Owner, OwnerMetaData>) => MutableModel<Owner, OwnerMetaData> | void,
  ): Owner;
};

type EagerStudent = {
  readonly id: string;
  readonly name?: string | null;
  readonly allSupportedFormFieldsID?: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyStudent = {
  readonly id: string;
  readonly name?: string | null;
  readonly allSupportedFormFieldsID?: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Student = LazyLoading extends LazyLoadingDisabled ? EagerStudent : LazyStudent;

export declare const Student: (new (init: ModelInit<Student, StudentMetaData>) => Student) & {
  copyOf(
    source: Student,
    mutator: (draft: MutableModel<Student, StudentMetaData>) => MutableModel<Student, StudentMetaData> | void,
  ): Student;
};

type EagerAllSupportedFormFields = {
  readonly id: string;

  readonly string?: string | null;

  readonly stringArray?: string[] | null;

  readonly int?: number | null;

  readonly float?: number | null;

  readonly awsDate?: string | null;

  readonly awsTime?: string | null;

  readonly awsDateTime?: string | null;

  readonly awsTimestamp?: number | null;

  readonly awsEmail?: string | null;

  readonly awsUrl?: string | null;

  readonly awsIPAddress?: string | null;

  readonly boolean?: boolean | null;

  readonly awsJson?: string | null;

  readonly awsPhone?: string | null;

  readonly enum?: City | keyof typeof City | null;

  readonly nonModelField?: string | null;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;

  readonly HasOneUser?: User | null;

  readonly BelongsToOwner?: Owner | null;

  readonly HasManyStudents?: (Student | null)[] | null;

  readonly ManyToManyTags?: (AllSupportedFormFieldsTag | null)[] | null;

  readonly allSupportedFormFieldsHasOneUserId?: string | null;
};

type LazyAllSupportedFormFields = {
  readonly id: string;

  readonly string?: string | null;

  readonly stringArray?: string[] | null;

  readonly int?: number | null;

  readonly float?: number | null;

  readonly awsDate?: string | null;

  readonly awsTime?: string | null;

  readonly awsDateTime?: string | null;

  readonly awsTimestamp?: number | null;

  readonly awsEmail?: string | null;

  readonly awsUrl?: string | null;

  readonly awsIPAddress?: string | null;

  readonly boolean?: boolean | null;

  readonly awsJson?: string | null;

  readonly awsPhone?: string | null;

  readonly enum?: City | keyof typeof City | null;

  readonly nonModelField?: string | null;

  readonly createdAt?: string | null;

  readonly updatedAt?: string | null;

  readonly HasOneUser?: AsyncItem<User | undefined>;

  readonly BelongsToOwner?: AsyncItem<Owner | undefined>;

  readonly HasManyStudents?: AsyncCollection<Student>;

  readonly ManyToManyTags?: AsyncCollection<AllSupportedFormFieldsTag>;

  readonly allSupportedFormFieldsHasOneUserId?: string | null;
};

export declare type AllSupportedFormFields = LazyLoading extends LazyLoadingDisabled
  ? EagerAllSupportedFormFields
  : LazyAllSupportedFormFields;

export declare const AllSupportedFormFields: (new (
  init: ModelInit<AllSupportedFormFields, AllSupportedFormFieldsMetaData>,
) => AllSupportedFormFields) & {
  copyOf(
    source: AllSupportedFormFields,
    mutator: (
      draft: MutableModel<AllSupportedFormFields, AllSupportedFormFieldsMetaData>,
    ) => MutableModel<AllSupportedFormFields, AllSupportedFormFieldsMetaData> | void,
  ): AllSupportedFormFields;
};

type EagerCPKStudent = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKStudent, 'specialStudentId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialStudentId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCPKStudent = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKStudent, 'specialStudentId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialStudentId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CPKStudent = LazyLoading extends LazyLoadingDisabled ? EagerCPKStudent : LazyCPKStudent;

export declare const CPKStudent: (new (init: ModelInit<CPKStudent>) => CPKStudent) & {
  copyOf(source: CPKStudent, mutator: (draft: MutableModel<CPKStudent>) => MutableModel<CPKStudent> | void): CPKStudent;
};

type EagerCPKTeacher = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKTeacher, 'specialTeacherId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialTeacherId: string;
  readonly CPKStudent?: CPKStudent | null;
  readonly CPKClasses?: (CPKTeacherCPKClass | null)[] | null;
  readonly CPKProjects?: (CPKProject | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly cPKTeacherCPKStudentSpecialStudentId?: string | null;
};

type LazyCPKTeacher = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKTeacher, 'specialTeacherId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialTeacherId: string;
  readonly CPKStudent: AsyncItem<CPKStudent | undefined>;
  readonly CPKClasses: AsyncCollection<CPKTeacherCPKClass>;
  readonly CPKProjects: AsyncCollection<CPKProject>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly cPKTeacherCPKStudentSpecialStudentId?: string | null;
};

export declare type CPKTeacher = LazyLoading extends LazyLoadingDisabled ? EagerCPKTeacher : LazyCPKTeacher;

export declare const CPKTeacher: (new (init: ModelInit<CPKTeacher>) => CPKTeacher) & {
  copyOf(source: CPKTeacher, mutator: (draft: MutableModel<CPKTeacher>) => MutableModel<CPKTeacher> | void): CPKTeacher;
};

type EagerCPKClass = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKClass, 'specialClassId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialClassId: string;
  readonly CPKTeachers?: (CPKTeacherCPKClass | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCPKClass = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKClass, 'specialClassId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialClassId: string;
  readonly CPKTeachers: AsyncCollection<CPKTeacherCPKClass>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CPKClass = LazyLoading extends LazyLoadingDisabled ? EagerCPKClass : LazyCPKClass;

export declare const CPKClass: (new (init: ModelInit<CPKClass>) => CPKClass) & {
  copyOf(source: CPKClass, mutator: (draft: MutableModel<CPKClass>) => MutableModel<CPKClass> | void): CPKClass;
};

type EagerCPKProject = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKProject, 'specialProjectId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialProjectId: string;
  readonly cPKTeacherID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCPKProject = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKProject, 'specialProjectId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialProjectId: string;
  readonly cPKTeacherID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CPKProject = LazyLoading extends LazyLoadingDisabled ? EagerCPKProject : LazyCPKProject;

export declare const CPKProject: (new (init: ModelInit<CPKProject>) => CPKProject) & {
  copyOf(source: CPKProject, mutator: (draft: MutableModel<CPKProject>) => MutableModel<CPKProject> | void): CPKProject;
};

type EagerCPKTeacherCPKClass = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CPKTeacherCPKClass, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cPKTeacherSpecialTeacherId?: string | null;
  readonly cPKClassSpecialClassId?: string | null;
  readonly cpkTeacher: CPKTeacher;
  readonly cpkClass: CPKClass;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCPKTeacherCPKClass = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CPKTeacherCPKClass, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cPKTeacherSpecialTeacherId?: string | null;
  readonly cPKClassSpecialClassId?: string | null;
  readonly cpkTeacher: AsyncItem<CPKTeacher>;
  readonly cpkClass: AsyncItem<CPKClass>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CPKTeacherCPKClass = LazyLoading extends LazyLoadingDisabled
  ? EagerCPKTeacherCPKClass
  : LazyCPKTeacherCPKClass;

export declare const CPKTeacherCPKClass: (new (init: ModelInit<CPKTeacherCPKClass>) => CPKTeacherCPKClass) & {
  copyOf(
    source: CPKTeacherCPKClass,
    mutator: (draft: MutableModel<CPKTeacherCPKClass>) => MutableModel<CPKTeacherCPKClass> | void,
  ): CPKTeacherCPKClass;
};
