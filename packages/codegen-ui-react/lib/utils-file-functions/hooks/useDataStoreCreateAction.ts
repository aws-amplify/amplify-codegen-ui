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

export const useDataStoreCreateActionString = `export const useDataStoreCreateAction = <Model extends PersistentModel>({
  model,
  fields: initialFields,
  schema,
}: UseDataStoreCreateActionOptions<Model>): (() => Promise<void>) => {
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
          event: ACTION_DATASTORE_CREATE_STARTED,
          data: { fields },
        },
        EVENT_ACTION_DATASTORE_CREATE,
        AMPLIFY_SYMBOL
      );

      const item = await DataStore.save(new model(fields));

      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_CREATE_FINISHED,
          data: { fields, item },
        },
        EVENT_ACTION_DATASTORE_CREATE,
        AMPLIFY_SYMBOL
      );
    } catch (error) {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_DATASTORE_CREATE_FINISHED,
          data: {
            fields,
            errorMessage: getErrorMessage(error),
          },
        },
        EVENT_ACTION_DATASTORE_CREATE,
        AMPLIFY_SYMBOL
      );
    }
  };
};`;
