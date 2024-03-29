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
export const UI_CHANNEL = 'ui';
export const UI_EVENT_TYPE_ACTIONS = 'actions';
export const CATEGORY_AUTH = 'auth';
export const CATEGORY_DATASTORE = 'datastore';
export const CATEGORY_CORE = 'core';
export const ACTION_AUTH_SIGNOUT = 'signout';
export const ACTION_NAVIGATE = 'navigate';
export const ACTION_DATASTORE_CREATE = 'create';
export const ACTION_DATASTORE_DELETE = 'delete';
export const ACTION_DATASTORE_UPDATE = 'update';
export const ACTION_STATE_MUTATION = 'statemutation';
export const STATUS_STARTED = 'started';
export const STATUS_FINISHED = 'finished';

// actions:auth:signout
export const EVENT_ACTION_AUTH = `${UI_EVENT_TYPE_ACTIONS}:${CATEGORY_AUTH}`;
export const EVENT_ACTION_AUTH_SIGNOUT = `${EVENT_ACTION_AUTH}:${ACTION_AUTH_SIGNOUT}`;
export const ACTION_AUTH_SIGNOUT_STARTED = `${EVENT_ACTION_AUTH_SIGNOUT}:${STATUS_STARTED}`;
export const ACTION_AUTH_SIGNOUT_FINISHED = `${EVENT_ACTION_AUTH_SIGNOUT}:${STATUS_FINISHED}`;

// actions:core
export const EVENT_ACTION_CORE = `${UI_EVENT_TYPE_ACTIONS}:${CATEGORY_CORE}`;
// actions:core:statemutation
export const EVENT_ACTION_CORE_STATE_MUTATION = `${EVENT_ACTION_CORE}:${ACTION_STATE_MUTATION}`;
export const ACTION_STATE_MUTATION_STARTED = `${EVENT_ACTION_CORE_STATE_MUTATION}:${STATUS_STARTED}`;
export const ACTION_STATE_MUTATION_FINISHED = `${EVENT_ACTION_CORE_STATE_MUTATION}:${STATUS_FINISHED}`;
// actions:core:navigate
export const EVENT_ACTION_CORE_NAVIGATE = `${EVENT_ACTION_CORE}:${ACTION_NAVIGATE}`;
export const ACTION_NAVIGATE_STARTED = `${EVENT_ACTION_CORE_NAVIGATE}:${STATUS_STARTED}`;
export const ACTION_NAVIGATE_FINISHED = `${EVENT_ACTION_CORE_NAVIGATE}:${STATUS_FINISHED}`;

// actions:datastore
export const EVENT_ACTION_DATASTORE = `${UI_EVENT_TYPE_ACTIONS}:${CATEGORY_DATASTORE}`;
// actions:datastore:create
export const EVENT_ACTION_DATASTORE_CREATE = `${EVENT_ACTION_DATASTORE}:${ACTION_DATASTORE_CREATE}`;
export const ACTION_DATASTORE_CREATE_STARTED = `${EVENT_ACTION_DATASTORE_CREATE}:${STATUS_STARTED}`;
export const ACTION_DATASTORE_CREATE_FINISHED = `${EVENT_ACTION_DATASTORE_CREATE}:${STATUS_FINISHED}`;
// actions:datastore:delete
export const EVENT_ACTION_DATASTORE_DELETE = `${EVENT_ACTION_DATASTORE}:${ACTION_DATASTORE_DELETE}`;
export const ACTION_DATASTORE_DELETE_STARTED = `${EVENT_ACTION_DATASTORE_DELETE}:${STATUS_STARTED}`;
export const ACTION_DATASTORE_DELETE_FINISHED = `${EVENT_ACTION_DATASTORE_DELETE}:${STATUS_FINISHED}`;
// actions:datastore:update
export const EVENT_ACTION_DATASTORE_UPDATE = `${EVENT_ACTION_DATASTORE}:${ACTION_DATASTORE_UPDATE}`;
export const ACTION_DATASTORE_UPDATE_STARTED = `${EVENT_ACTION_DATASTORE_UPDATE}:${STATUS_STARTED}`;
export const ACTION_DATASTORE_UPDATE_FINISHED = `${EVENT_ACTION_DATASTORE_UPDATE}:${STATUS_FINISHED}`;

export const DATASTORE_QUERY_BY_ID_ERROR = 'Error querying datastore item by id';

export const constantsString = `export const UI_CHANNEL = 'ui';
export const UI_EVENT_TYPE_ACTIONS = 'actions';
export const CATEGORY_AUTH = 'auth';
export const CATEGORY_DATASTORE = 'datastore';
export const CATEGORY_CORE = 'core';
export const ACTION_AUTH_SIGNOUT = 'signout';
export const ACTION_NAVIGATE = 'navigate';
export const ACTION_DATASTORE_CREATE = 'create';
export const ACTION_DATASTORE_DELETE = 'delete';
export const ACTION_DATASTORE_UPDATE = 'update';
export const ACTION_STATE_MUTATION = 'statemutation';
export const STATUS_STARTED = 'started';
export const STATUS_FINISHED = 'finished';
export const EVENT_ACTION_AUTH = \`\${UI_EVENT_TYPE_ACTIONS}:\${CATEGORY_AUTH}\`;
export const EVENT_ACTION_AUTH_SIGNOUT = \`\${EVENT_ACTION_AUTH}:\${ACTION_AUTH_SIGNOUT}\`;
export const ACTION_AUTH_SIGNOUT_STARTED = \`\${EVENT_ACTION_AUTH_SIGNOUT}:\${STATUS_STARTED}\`;
export const ACTION_AUTH_SIGNOUT_FINISHED = \`\${EVENT_ACTION_AUTH_SIGNOUT}:\${STATUS_FINISHED}\`;
export const EVENT_ACTION_CORE = \`\${UI_EVENT_TYPE_ACTIONS}:\${CATEGORY_CORE}\`;
export const EVENT_ACTION_CORE_STATE_MUTATION = \`\${EVENT_ACTION_CORE}:\${ACTION_STATE_MUTATION}\`;
export const ACTION_STATE_MUTATION_STARTED = \`\${EVENT_ACTION_CORE_STATE_MUTATION}:\${STATUS_STARTED}\`;
export const ACTION_STATE_MUTATION_FINISHED = \`\${EVENT_ACTION_CORE_STATE_MUTATION}:\${STATUS_FINISHED}\`;
export const EVENT_ACTION_CORE_NAVIGATE = \`\${EVENT_ACTION_CORE}:\${ACTION_NAVIGATE}\`;
export const ACTION_NAVIGATE_STARTED = \`\${EVENT_ACTION_CORE_NAVIGATE}:\${STATUS_STARTED}\`;
export const ACTION_NAVIGATE_FINISHED = \`\${EVENT_ACTION_CORE_NAVIGATE}:\${STATUS_FINISHED}\`;
export const EVENT_ACTION_DATASTORE = \`\${UI_EVENT_TYPE_ACTIONS}:\${CATEGORY_DATASTORE}\`;
export const EVENT_ACTION_DATASTORE_CREATE = \`\${EVENT_ACTION_DATASTORE}:\${ACTION_DATASTORE_CREATE}\`;
export const ACTION_DATASTORE_CREATE_STARTED = \`\${EVENT_ACTION_DATASTORE_CREATE}:\${STATUS_STARTED}\`;
export const ACTION_DATASTORE_CREATE_FINISHED = \`\${EVENT_ACTION_DATASTORE_CREATE}:\${STATUS_FINISHED}\`;
export const EVENT_ACTION_DATASTORE_DELETE = \`\${EVENT_ACTION_DATASTORE}:\${ACTION_DATASTORE_DELETE}\`;
export const ACTION_DATASTORE_DELETE_STARTED = \`\${EVENT_ACTION_DATASTORE_DELETE}:\${STATUS_STARTED}\`;
export const ACTION_DATASTORE_DELETE_FINISHED = \`\${EVENT_ACTION_DATASTORE_DELETE}:\${STATUS_FINISHED}\`;
export const EVENT_ACTION_DATASTORE_UPDATE = \`\${EVENT_ACTION_DATASTORE}:\${ACTION_DATASTORE_UPDATE}\`;
export const ACTION_DATASTORE_UPDATE_STARTED = \`\${EVENT_ACTION_DATASTORE_UPDATE}:\${STATUS_STARTED}\`;
export const ACTION_DATASTORE_UPDATE_FINISHED = \`\${EVENT_ACTION_DATASTORE_UPDATE}:\${STATUS_FINISHED}\`;
export const DATASTORE_QUERY_BY_ID_ERROR = 'Error querying datastore item by id';`;
