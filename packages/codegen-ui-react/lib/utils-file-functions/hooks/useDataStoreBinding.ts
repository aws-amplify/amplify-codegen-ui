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
export const useDataStoreBindingString = `export const useDataStoreCollection = <M extends PersistentModel>({
  model,
  criteria,
  pagination,
}: DataStoreCollectionProps<M>): DataStoreCollectionResult<M> => {
  const [result, setResult] = React.useState<DataStoreCollectionResult<M>>({
    items: [],
    isLoading: false,
    error: undefined,
  });

  const fetch = () => {
    setResult({ isLoading: true, items: [] });

    const subscription = DataStore.observeQuery(
      model,
      criteria,
      pagination
    ).subscribe(
      (snapshot) => setResult({ items: snapshot.items, isLoading: false }),
      (error: Error) => setResult({ items: [], error, isLoading: false })
    );

    if (subscription) {
      return () => subscription.unsubscribe();
    }
  };

  React.useEffect(fetch, []);
  return result;
};

export const useDataStoreItem = <M extends PersistentModel>({
  model,
  id,
}: DataStoreItemProps<M>): DataStoreItemResult<M> => {
  const [item, setItem] = React.useState<M>();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error>();

  const fetch = () => {
    setLoading(true);

    DataStore.query(model, id)
      .then(setItem)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  React.useEffect(fetch, []);
  return {
    error,
    item,
    isLoading,
  };
};

export function useDataStoreBinding<Model extends PersistentModel>(
  props: DataStoreBindingProps<Model, 'record'>
): DataStoreItemResult<Model>;
export function useDataStoreBinding<Model extends PersistentModel>(
  props: DataStoreBindingProps<Model, 'collection'>
): DataStoreCollectionResult<Model>;
export function useDataStoreBinding<Model extends PersistentModel>(
  props:
    | DataStoreBindingProps<Model, 'record'>
    | DataStoreBindingProps<Model, 'collection'>
): DataStoreItemResult<Model> | DataStoreCollectionResult<Model> {
  return props.type === 'record'
    ? useDataStoreItem(props) : useDataStoreCollection(props);
};`;
