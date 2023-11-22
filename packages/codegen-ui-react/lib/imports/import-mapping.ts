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
export enum ImportSource {
  REACT = 'react',
  UI_REACT = '@aws-amplify/ui-react',
  UI_REACT_INTERNAL = '@aws-amplify/ui-react/internal',
  AMPLIFY_DATASTORE = '@aws-amplify/datastore',
  REACT_STORAGE = '@aws-amplify/ui-react-storage',
  LOCAL_MODELS = '../models',
  LOCAL_SCHEMA = '../models/schema',
  UTILS = './utils',
  AMPLIFY = 'aws-amplify',
  AMPLIFY_API = 'aws-amplify/api',
  AMPLIFY_AUTH = 'aws-amplify/auth',
  AMPLIFY_UTILS = 'aws-amplify/utils',
  AMPLIFY_DATASTORE_V6 = 'aws-amplify/datastore',
}

export enum ImportValue {
  GET_OVERRIDE_PROPS = 'getOverrideProps',
  USE_AUTH = 'useAuth',
  AUTH = 'Auth',
  SIGN_OUT = 'signOut',
  FETCH_USER_ATTRIBUTES = 'fetchUserAttributes',
  GET_OVERRIDES_FROM_VARIANTS = 'getOverridesFromVariants',
  USE_BREAKPOINT_VALUE = 'useBreakpointValue',
  VARIANT = 'Variant',
  SORT_DIRECTION = 'SortDirection',
  SORT_PREDICATE = 'SortPredicate',
  CREATE_DATA_STORE_PREDICATE = 'createDataStorePredicate',
  USE_DATA_STORE_BINDING = 'useDataStoreBinding',
  CREATE_THEME = 'createTheme',
  MERGE_VARIANTS_OVERRIDES = 'mergeVariantsAndOverrides',
  USE_NAVIGATE_ACTION = 'useNavigateAction',
  USE_DATA_STORE_CREATE_ACTION = 'useDataStoreCreateAction',
  USE_DATA_STORE_UPDATE_ACTION = 'useDataStoreUpdateAction',
  USE_DATA_STORE_DELETE_ACTION = 'useDataStoreDeleteAction',
  USE_AUTH_SIGN_OUT_ACTION = 'useAuthSignOutAction',
  USE_STATE_MUTATION_ACTION = 'useStateMutationAction',
  USE_EFFECT = 'useEffect',
  VALIDATE_FIELD = 'validateField',
  VALIDATE_FIELD_CODEGEN = 'validateField',
  FORMATTER = 'formatter',
  FETCH_BY_PATH = 'fetchByPath',
  PROCESS_FILE = 'processFile',
  DEFAULT_THEME = 'defaultTheme',
  USE_STATE = 'useState',
  API = 'API',
  HUB = 'Hub',
  DATASTORE = 'DataStore',
  PAGINATION = 'Pagination',
  PLACEHOLDER = 'Placeholder',
  GENERATE_CLIENT = 'generateClient',
}

export const ImportMapping: Record<ImportValue, ImportSource> = {
  [ImportValue.API]: ImportSource.AMPLIFY,
  [ImportValue.AUTH]: ImportSource.AMPLIFY,
  [ImportValue.SIGN_OUT]: ImportSource.AMPLIFY_AUTH,
  [ImportValue.HUB]: ImportSource.AMPLIFY,
  [ImportValue.DATASTORE]: ImportSource.AMPLIFY,
  [ImportValue.GENERATE_CLIENT]: ImportSource.AMPLIFY_API,
  [ImportValue.SORT_DIRECTION]: ImportSource.AMPLIFY_DATASTORE,
  [ImportValue.SORT_PREDICATE]: ImportSource.AMPLIFY_DATASTORE,
  [ImportValue.CREATE_THEME]: ImportSource.UI_REACT,
  [ImportValue.DEFAULT_THEME]: ImportSource.UI_REACT,
  [ImportValue.PAGINATION]: ImportSource.UI_REACT,
  [ImportValue.PLACEHOLDER]: ImportSource.UI_REACT,
  [ImportValue.USE_BREAKPOINT_VALUE]: ImportSource.UI_REACT,
  [ImportValue.USE_AUTH]: ImportSource.UI_REACT_INTERNAL,
  [ImportValue.CREATE_DATA_STORE_PREDICATE]: ImportSource.UTILS,
  [ImportValue.USE_DATA_STORE_BINDING]: ImportSource.UTILS,
  [ImportValue.USE_NAVIGATE_ACTION]: ImportSource.UTILS,
  [ImportValue.USE_DATA_STORE_CREATE_ACTION]: ImportSource.UTILS,
  [ImportValue.USE_DATA_STORE_UPDATE_ACTION]: ImportSource.UTILS,
  [ImportValue.USE_DATA_STORE_DELETE_ACTION]: ImportSource.UTILS,
  [ImportValue.USE_AUTH_SIGN_OUT_ACTION]: ImportSource.UTILS,
  [ImportValue.USE_STATE_MUTATION_ACTION]: ImportSource.UTILS,
  [ImportValue.GET_OVERRIDE_PROPS]: ImportSource.UTILS,
  [ImportValue.MERGE_VARIANTS_OVERRIDES]: ImportSource.UTILS,
  [ImportValue.GET_OVERRIDES_FROM_VARIANTS]: ImportSource.UTILS,
  [ImportValue.VARIANT]: ImportSource.UTILS,
  [ImportValue.FORMATTER]: ImportSource.UTILS,
  [ImportValue.VALIDATE_FIELD]: ImportSource.UTILS,
  [ImportValue.FETCH_BY_PATH]: ImportSource.UTILS,
  [ImportValue.PROCESS_FILE]: ImportSource.UTILS,
  [ImportValue.USE_EFFECT]: ImportSource.REACT,
  [ImportValue.USE_STATE]: ImportSource.REACT,
  [ImportValue.FETCH_USER_ATTRIBUTES]: ImportSource.AMPLIFY_AUTH,
};
