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
  CompositeIdentifier,
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
  readonly CPKStudent: CPKStudent;
  readonly CPKClasses?: (CPKTeacherCPKClass | null)[] | null;
  readonly CPKProjects?: (CPKProject | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly cPKTeacherCPKStudentSpecialStudentId: string;
};

type LazyCPKTeacher = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<CPKTeacher, 'specialTeacherId'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialTeacherId: string;
  readonly CPKStudent: AsyncItem<CPKStudent>;
  readonly CPKClasses: AsyncCollection<CPKTeacherCPKClass>;
  readonly CPKProjects: AsyncCollection<CPKProject>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly cPKTeacherCPKStudentSpecialStudentId: string;
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

type EagerCompositeDog = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeDog, ['name', 'description']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly name: string;
  readonly description: string;
  readonly CompositeBowl?: CompositeBowl | null;
  readonly CompositeOwner?: CompositeOwner | null;
  readonly CompositeToys?: (CompositeToy | null)[] | null;
  readonly CompositeVets?: (CompositeDogCompositeVet | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeDogCompositeBowlShape?: string | null;
  readonly compositeDogCompositeBowlSize?: string | null;
  readonly compositeDogCompositeOwnerLastName?: string | null;
  readonly compositeDogCompositeOwnerFirstName?: string | null;
};

type LazyCompositeDog = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeDog, ['name', 'description']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly name: string;
  readonly description: string;
  readonly CompositeBowl: AsyncItem<CompositeBowl | undefined>;
  readonly CompositeOwner: AsyncItem<CompositeOwner | undefined>;
  readonly CompositeToys: AsyncCollection<CompositeToy>;
  readonly CompositeVets: AsyncCollection<CompositeDogCompositeVet>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeDogCompositeBowlShape?: string | null;
  readonly compositeDogCompositeBowlSize?: string | null;
  readonly compositeDogCompositeOwnerLastName?: string | null;
  readonly compositeDogCompositeOwnerFirstName?: string | null;
};

export declare type CompositeDog = LazyLoading extends LazyLoadingDisabled ? EagerCompositeDog : LazyCompositeDog;

export declare const CompositeDog: (new (init: ModelInit<CompositeDog>) => CompositeDog) & {
  copyOf(
    source: CompositeDog,
    mutator: (draft: MutableModel<CompositeDog>) => MutableModel<CompositeDog> | void,
  ): CompositeDog;
};

type EagerCompositeBowl = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeBowl, ['shape', 'size']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly shape: string;
  readonly size: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCompositeBowl = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeBowl, ['shape', 'size']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly shape: string;
  readonly size: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CompositeBowl = LazyLoading extends LazyLoadingDisabled ? EagerCompositeBowl : LazyCompositeBowl;

export declare const CompositeBowl: (new (init: ModelInit<CompositeBowl>) => CompositeBowl) & {
  copyOf(
    source: CompositeBowl,
    mutator: (draft: MutableModel<CompositeBowl>) => MutableModel<CompositeBowl> | void,
  ): CompositeBowl;
};

type EagerCompositeOwner = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeOwner, ['lastName', 'firstName']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly lastName: string;
  readonly firstName: string;
  readonly CompositeDog?: CompositeDog | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeOwnerCompositeDogName?: string | null;
  readonly compositeOwnerCompositeDogDescription?: string | null;
};

type LazyCompositeOwner = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeOwner, ['lastName', 'firstName']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly lastName: string;
  readonly firstName: string;
  readonly CompositeDog: AsyncItem<CompositeDog | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeOwnerCompositeDogName?: string | null;
  readonly compositeOwnerCompositeDogDescription?: string | null;
};

export declare type CompositeOwner = LazyLoading extends LazyLoadingDisabled ? EagerCompositeOwner : LazyCompositeOwner;

export declare const CompositeOwner: (new (init: ModelInit<CompositeOwner>) => CompositeOwner) & {
  copyOf(
    source: CompositeOwner,
    mutator: (draft: MutableModel<CompositeOwner>) => MutableModel<CompositeOwner> | void,
  ): CompositeOwner;
};

type EagerCompositeToy = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeToy, ['kind', 'color']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly kind: string;
  readonly color: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeDogCompositeToysName?: string | null;
  readonly compositeDogCompositeToysDescription?: string | null;
};

type LazyCompositeToy = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeToy, ['kind', 'color']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly kind: string;
  readonly color: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly compositeDogCompositeToysName?: string | null;
  readonly compositeDogCompositeToysDescription?: string | null;
};

export declare type CompositeToy = LazyLoading extends LazyLoadingDisabled ? EagerCompositeToy : LazyCompositeToy;

export declare const CompositeToy: (new (init: ModelInit<CompositeToy>) => CompositeToy) & {
  copyOf(
    source: CompositeToy,
    mutator: (draft: MutableModel<CompositeToy>) => MutableModel<CompositeToy> | void,
  ): CompositeToy;
};

type EagerCompositeVet = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeVet, ['specialty', 'city']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialty: string;
  readonly city: string;
  readonly CompositeDogs?: (CompositeDogCompositeVet | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCompositeVet = {
  readonly [__modelMeta__]: {
    identifier: CompositeIdentifier<CompositeVet, ['specialty', 'city']>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly specialty: string;
  readonly city: string;
  readonly CompositeDogs: AsyncCollection<CompositeDogCompositeVet>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CompositeVet = LazyLoading extends LazyLoadingDisabled ? EagerCompositeVet : LazyCompositeVet;

export declare const CompositeVet: (new (init: ModelInit<CompositeVet>) => CompositeVet) & {
  copyOf(
    source: CompositeVet,
    mutator: (draft: MutableModel<CompositeVet>) => MutableModel<CompositeVet> | void,
  ): CompositeVet;
};

type EagerCompositeDogCompositeVet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CompositeDogCompositeVet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly compositeDogName?: string | null;
  readonly compositeDogdescription?: string | null;
  readonly compositeVetSpecialty?: string | null;
  readonly compositeVetcity?: string | null;
  readonly compositeDog: CompositeDog;
  readonly compositeVet: CompositeVet;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCompositeDogCompositeVet = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<CompositeDogCompositeVet, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly compositeDogName?: string | null;
  readonly compositeDogdescription?: string | null;
  readonly compositeVetSpecialty?: string | null;
  readonly compositeVetcity?: string | null;
  readonly compositeDog: AsyncItem<CompositeDog>;
  readonly compositeVet: AsyncItem<CompositeVet>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type CompositeDogCompositeVet = LazyLoading extends LazyLoadingDisabled
  ? EagerCompositeDogCompositeVet
  : LazyCompositeDogCompositeVet;

export declare const CompositeDogCompositeVet: (new (
  init: ModelInit<CompositeDogCompositeVet>,
) => CompositeDogCompositeVet) & {
  copyOf(
    source: CompositeDogCompositeVet,
    mutator: (draft: MutableModel<CompositeDogCompositeVet>) => MutableModel<CompositeDogCompositeVet> | void,
  ): CompositeDogCompositeVet;
};
