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
import { ModelInit, MutableModel } from '@aws-amplify/datastore';

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

export declare class User {
  readonly id: string;

  readonly firstName?: string;

  readonly lastName?: string;

  readonly age?: number;

  readonly isLoggedIn?: boolean;

  readonly loggedInColor?: string;

  readonly loggedOutColor?: string;

  readonly createdAt?: string;

  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(
    source: User,
    mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void,
  ): User;
}

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
