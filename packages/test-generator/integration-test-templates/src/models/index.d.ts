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

/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  ModelInit,
  MutableModel,
  __modelMeta__,
  ManagedIdentifier,
  CustomIdentifier,
  CompositeIdentifier,
} from '@aws-amplify/datastore';
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from '@aws-amplify/datastore';

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

type EagerCustomType = {
  readonly StringVal?: string | null;
  readonly NumVal?: number | null;
  readonly BoolVal?: boolean | null;
};

type LazyCustomType = {
  readonly StringVal?: string | null;
  readonly NumVal?: number | null;
  readonly BoolVal?: boolean | null;
};

export declare type CustomType = LazyLoading extends LazyLoadingDisabled ? EagerCustomType : LazyCustomType;

export declare const CustomType: new (init: ModelInit<CustomType>) => CustomType;

type EagerUserPreference = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserPreference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly favoriteColor?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyUserPreference = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserPreference, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly favoriteColor?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type UserPreference = LazyLoading extends LazyLoadingDisabled ? EagerUserPreference : LazyUserPreference;

export declare const UserPreference: (new (init: ModelInit<UserPreference>) => UserPreference) & {
  copyOf(
    source: UserPreference,
    mutator: (draft: MutableModel<UserPreference>) => MutableModel<UserPreference> | void,
  ): UserPreference;
};

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly age?: number | null;
  readonly isLoggedIn?: boolean | null;
  readonly loggedInColor?: string | null;
  readonly loggedOutColor?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly age?: number | null;
  readonly isLoggedIn?: boolean | null;
  readonly loggedInColor?: string | null;
  readonly loggedOutColor?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser;

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
};

type EagerListing = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listing, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly priceUSD?: number | null;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyListing = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Listing, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly priceUSD?: number | null;
  readonly description?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Listing = LazyLoading extends LazyLoadingDisabled ? EagerListing : LazyListing;

export declare const Listing: (new (init: ModelInit<Listing>) => Listing) & {
  copyOf(source: Listing, mutator: (draft: MutableModel<Listing>) => MutableModel<Listing> | void): Listing;
};

type EagerComplexModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ComplexModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly listElement: (string | null)[];
  readonly myCustomField?: CustomType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyComplexModel = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ComplexModel, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly listElement: (string | null)[];
  readonly myCustomField?: CustomType | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ComplexModel = LazyLoading extends LazyLoadingDisabled ? EagerComplexModel : LazyComplexModel;

export declare const ComplexModel: (new (init: ModelInit<ComplexModel>) => ComplexModel) & {
  copyOf(
    source: ComplexModel,
    mutator: (draft: MutableModel<ComplexModel>) => MutableModel<ComplexModel> | void,
  ): ComplexModel;
};

type EagerClass = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Class, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyClass = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Class, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Class = LazyLoading extends LazyLoadingDisabled ? EagerClass : LazyClass;

export declare const Class: (new (init: ModelInit<Class>) => Class) & {
  copyOf(source: Class, mutator: (draft: MutableModel<Class>) => MutableModel<Class> | void): Class;
};

type EagerTag = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Tag, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly label?: string | null;
  readonly AllSupportedFormFields?: (AllSupportedFormFieldsTag | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyTag = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Tag, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly label?: string | null;
  readonly AllSupportedFormFields: AsyncCollection<AllSupportedFormFieldsTag>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Tag = LazyLoading extends LazyLoadingDisabled ? EagerTag : LazyTag;

export declare const Tag: (new (init: ModelInit<Tag>) => Tag) & {
  copyOf(source: Tag, mutator: (draft: MutableModel<Tag>) => MutableModel<Tag> | void): Tag;
};

type EagerAllSupportedFormFields = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllSupportedFormFields, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly string?: string | null;
  readonly stringArray?: (string | null)[] | null;
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
  readonly nonModelField?: CustomType | null;
  readonly nonModelFieldArray?: (CustomType | null)[] | null;
  readonly HasOneUser?: User | null;
  readonly BelongsToOwner?: Owner | null;
  readonly HasManyStudents?: (Student | null)[] | null;
  readonly ManyToManyTags?: (AllSupportedFormFieldsTag | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly allSupportedFormFieldsHasOneUserId?: string | null;
  readonly allSupportedFormFieldsBelongsToOwnerId?: string | null;
};

type LazyAllSupportedFormFields = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllSupportedFormFields, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly string?: string | null;
  readonly stringArray?: (string | null)[] | null;
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
  readonly nonModelField?: CustomType | null;
  readonly nonModelFieldArray?: (CustomType | null)[] | null;
  readonly HasOneUser: AsyncItem<User | undefined>;
  readonly BelongsToOwner: AsyncItem<Owner | undefined>;
  readonly HasManyStudents: AsyncCollection<Student>;
  readonly ManyToManyTags: AsyncCollection<AllSupportedFormFieldsTag>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly allSupportedFormFieldsHasOneUserId?: string | null;
  readonly allSupportedFormFieldsBelongsToOwnerId?: string | null;
};

export declare type AllSupportedFormFields = LazyLoading extends LazyLoadingDisabled
  ? EagerAllSupportedFormFields
  : LazyAllSupportedFormFields;

export declare const AllSupportedFormFields: (new (
  init: ModelInit<AllSupportedFormFields>,
) => AllSupportedFormFields) & {
  copyOf(
    source: AllSupportedFormFields,
    mutator: (draft: MutableModel<AllSupportedFormFields>) => MutableModel<AllSupportedFormFields> | void,
  ): AllSupportedFormFields;
};

type EagerOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly AllSupportedFormFields?: AllSupportedFormFields | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ownerAllSupportedFormFieldsId?: string | null;
};

type LazyOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Owner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly AllSupportedFormFields: AsyncItem<AllSupportedFormFields | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly ownerAllSupportedFormFieldsId?: string | null;
};

export declare type Owner = LazyLoading extends LazyLoadingDisabled ? EagerOwner : LazyOwner;

export declare const Owner: (new (init: ModelInit<Owner>) => Owner) & {
  copyOf(source: Owner, mutator: (draft: MutableModel<Owner>) => MutableModel<Owner> | void): Owner;
};

type EagerStudent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Student, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly allSupportedFormFieldsID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyStudent = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Student, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly allSupportedFormFieldsID?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Student = LazyLoading extends LazyLoadingDisabled ? EagerStudent : LazyStudent;

export declare const Student: (new (init: ModelInit<Student>) => Student) & {
  copyOf(source: Student, mutator: (draft: MutableModel<Student>) => MutableModel<Student> | void): Student;
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

type EagerBiDirectionalDog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalDog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly BiDirectionalOwner?: BiDirectionalOwner | null;
  readonly BiDirectionalToys?: (BiDirectionalToy | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly biDirectionalDogBiDirectionalOwnerId?: string | null;
};

type LazyBiDirectionalDog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalDog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly BiDirectionalOwner: AsyncItem<BiDirectionalOwner | undefined>;
  readonly BiDirectionalToys: AsyncCollection<BiDirectionalToy>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly biDirectionalDogBiDirectionalOwnerId?: string | null;
};

export declare type BiDirectionalDog = LazyLoading extends LazyLoadingDisabled
  ? EagerBiDirectionalDog
  : LazyBiDirectionalDog;

export declare const BiDirectionalDog: (new (init: ModelInit<BiDirectionalDog>) => BiDirectionalDog) & {
  copyOf(
    source: BiDirectionalDog,
    mutator: (draft: MutableModel<BiDirectionalDog>) => MutableModel<BiDirectionalDog> | void,
  ): BiDirectionalDog;
};

type EagerBiDirectionalOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalOwner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly biDirectionalDogID: string;
  readonly BiDirectionalDog: BiDirectionalDog;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyBiDirectionalOwner = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalOwner, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly biDirectionalDogID: string;
  readonly BiDirectionalDog: AsyncItem<BiDirectionalDog>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type BiDirectionalOwner = LazyLoading extends LazyLoadingDisabled
  ? EagerBiDirectionalOwner
  : LazyBiDirectionalOwner;

export declare const BiDirectionalOwner: (new (init: ModelInit<BiDirectionalOwner>) => BiDirectionalOwner) & {
  copyOf(
    source: BiDirectionalOwner,
    mutator: (draft: MutableModel<BiDirectionalOwner>) => MutableModel<BiDirectionalOwner> | void,
  ): BiDirectionalOwner;
};

type EagerBiDirectionalToy = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalToy, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly biDirectionalDogID: string;
  readonly BiDirectionalDog: BiDirectionalDog;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly biDirectionalDogBiDirectionalToysId?: string | null;
};

type LazyBiDirectionalToy = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<BiDirectionalToy, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly biDirectionalDogID: string;
  readonly BiDirectionalDog: AsyncItem<BiDirectionalDog>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly biDirectionalDogBiDirectionalToysId?: string | null;
};

export declare type BiDirectionalToy = LazyLoading extends LazyLoadingDisabled
  ? EagerBiDirectionalToy
  : LazyBiDirectionalToy;

export declare const BiDirectionalToy: (new (init: ModelInit<BiDirectionalToy>) => BiDirectionalToy) & {
  copyOf(
    source: BiDirectionalToy,
    mutator: (draft: MutableModel<BiDirectionalToy>) => MutableModel<BiDirectionalToy> | void,
  ): BiDirectionalToy;
};

type EagerModelWithVariableCollisions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ModelWithVariableCollisions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly modelWithVariableCollisions?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyModelWithVariableCollisions = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ModelWithVariableCollisions, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly modelWithVariableCollisions?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type ModelWithVariableCollisions = LazyLoading extends LazyLoadingDisabled
  ? EagerModelWithVariableCollisions
  : LazyModelWithVariableCollisions;

export declare const ModelWithVariableCollisions: (new (
  init: ModelInit<ModelWithVariableCollisions>,
) => ModelWithVariableCollisions) & {
  copyOf(
    source: ModelWithVariableCollisions,
    mutator: (draft: MutableModel<ModelWithVariableCollisions>) => MutableModel<ModelWithVariableCollisions> | void,
  ): ModelWithVariableCollisions;
};

type EagerDealership = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dealership, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly cars?: (Car | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyDealership = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Dealership, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly cars: AsyncCollection<Car>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Dealership = LazyLoading extends LazyLoadingDisabled ? EagerDealership : LazyDealership;

export declare const Dealership: (new (init: ModelInit<Dealership>) => Dealership) & {
  copyOf(source: Dealership, mutator: (draft: MutableModel<Dealership>) => MutableModel<Dealership> | void): Dealership;
};

type EagerCar = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Car, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly dealershipId?: string | null;
  readonly dealership?: Dealership | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyCar = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Car, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly dealershipId?: string | null;
  readonly dealership: AsyncItem<Dealership | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type Car = LazyLoading extends LazyLoadingDisabled ? EagerCar : LazyCar;

export declare const Car: (new (init: ModelInit<Car>) => Car) & {
  copyOf(source: Car, mutator: (draft: MutableModel<Car>) => MutableModel<Car> | void): Car;
};

type EagerAllSupportedFormFieldsTag = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllSupportedFormFieldsTag, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly tagId?: string | null;
  readonly allSupportedFormFieldsId?: string | null;
  readonly tag: Tag;
  readonly allSupportedFormFields: AllSupportedFormFields;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyAllSupportedFormFieldsTag = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<AllSupportedFormFieldsTag, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly tagId?: string | null;
  readonly allSupportedFormFieldsId?: string | null;
  readonly tag: AsyncItem<Tag>;
  readonly allSupportedFormFields: AsyncItem<AllSupportedFormFields>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type AllSupportedFormFieldsTag = LazyLoading extends LazyLoadingDisabled
  ? EagerAllSupportedFormFieldsTag
  : LazyAllSupportedFormFieldsTag;

export declare const AllSupportedFormFieldsTag: (new (
  init: ModelInit<AllSupportedFormFieldsTag>,
) => AllSupportedFormFieldsTag) & {
  copyOf(
    source: AllSupportedFormFieldsTag,
    mutator: (draft: MutableModel<AllSupportedFormFieldsTag>) => MutableModel<AllSupportedFormFieldsTag> | void,
  ): AllSupportedFormFieldsTag;
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
