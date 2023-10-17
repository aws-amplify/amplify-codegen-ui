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
import { IdentifierFieldOrIdentifierObject, PersistentModel, PersistentModelMetaData } from '@aws-amplify/datastore';
import { DataStore, Hub } from 'aws-amplify';

import {
  ACTION_DATASTORE_UPDATE_FINISHED,
  ACTION_DATASTORE_UPDATE_STARTED,
  DATASTORE_QUERY_BY_ID_ERROR,
  EVENT_ACTION_DATASTORE_UPDATE,
  UI_CHANNEL,
} from './constants';
import { UseDataStoreActionOptions } from './datastore-action-types';
import { useTypeCastFields } from './useTypeCastFields';
import { AMPLIFY_SYMBOL } from '../amplify-symbol';
import { getErrorMessage } from '../get-error-message';

export interface UseDataStoreUpdateActionOptions<Model extends PersistentModel>
  extends UseDataStoreActionOptions<Model> {
  id: IdentifierFieldOrIdentifierObject<Model, PersistentModelMetaData<Model>>;
}

/**
 * Action to Update DataStore item
 * @internal
 */
export const useDataStoreUpdateAction = <Model extends PersistentModel>({
  fields: initialFields,
  id,
  model,
  schema,
}: UseDataStoreUpdateActionOptions<Model>): (() => Promise<void>) => {
  const fields = useTypeCastFields<Model>({
    fields: initialFields,
    modelName: model.name,
    schema,
  });

  return async () => {
    try {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_STARTED,
          data: { fields, id },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL,
      );

      const original = await DataStore.query(model, id);

      if (!original) {
        throw new Error(`${DATASTORE_QUERY_BY_ID_ERROR}: ${id}`);
      }

      const item = await DataStore.save(
        model.copyOf(original, (updated: any) => {
          Object.assign(updated, fields);
        }),
      );

      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_FINISHED,
          data: { fields, id, item },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL,
      );
    } catch (error) {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_FINISHED,
          data: {
            fields,
            id,
            errorMessage: getErrorMessage(error),
          },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL,
      );
    }
  };
};

export const useDataStoreUpdateActionString = `export const useDataStoreUpdateAction = <Model extends PersistentModel>({
  fields: initialFields,
  id,
  model,
  schema,
}: UseDataStoreUpdateActionOptions<Model>): (() => Promise<void>) => {
  const fields = useTypeCastFields<Model>({
    fields: initialFields,
    modelName: model.name,
    schema,
  });

  return async () => {
    try {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_STARTED,
          data: { fields, id },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL
      );

      const original = await DataStore.query(model, id);

      if (!original) {
        throw new Error(\`\${DATASTORE_QUERY_BY_ID_ERROR}: \${id}\`);
      }

      const item = await DataStore.save(
        model.copyOf(original, (updated: any) => {
          Object.assign(updated, fields);
        })
      );

      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_FINISHED,
          data: { fields, id, item },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL
      );
    } catch (error) {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_UPDATE_FINISHED,
          data: {
            fields,
            id,
            errorMessage: getErrorMessage(error),
          },
        },
        EVENT_ACTION_DATASTORE_UPDATE,
        AMPLIFY_SYMBOL
      );
    }
  };
};`;
