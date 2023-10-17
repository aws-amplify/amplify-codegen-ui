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
import { DataStore, PersistentModelConstructor, SortDirection, ProducerPaginationInput } from '@aws-amplify/datastore';
import { renderHook } from '@testing-library/react-hooks';
import { useDataStoreBinding, useDataStoreCollection, useDataStoreItem } from '../useDataStoreBinding';
import { Todo } from './test-models/models';
import { createDataStorePredicate } from '../createDataStorePredicate';

jest.mock('@aws-amplify/datastore');

type FakeModel = PersistentModelConstructor<Todo>;
type Callback = (x: any) => void;

const fakeModel = {
  id: 'FakeModel',
} as unknown as FakeModel;

const nextFakeModel = {
  id: 'nextFakeModel',
} as unknown as FakeModel;

const fakeItem = {
  fakeField: 'fake-value',
} as unknown as FakeModel;

const fakePagination = {
  limit: 100,
  sort: (s: { rating: (s: SortDirection) => void }) => s.rating(SortDirection.ASCENDING),
} as unknown as ProducerPaginationInput<Todo>;

const fakeId = 'fake-id';

describe('useDataStoreCollection', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return default values while data is being fetched', () => {
    (DataStore.observeQuery as jest.Mock).mockImplementation(() => ({
      subscribe: () => ({
        unsubscribe: jest.fn(),
      }),
    }));

    const { result } = renderHook(() =>
      useDataStoreCollection({
        model: fakeModel,
      }),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toHaveLength(0);
    expect(result.current.error).toBeUndefined();
  });

  it('should set error if DataStore.observeQuery throws an error', async () => {
    const fakeError = new Error('Unexpected DataStore error');
    const fakeDataStoreObserveQuery = jest.fn(() => ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      subscribe: (_: any, onError: Callback) => {
        setTimeout(() => onError(fakeError), 500);
        return { unsubscribe: () => {} };
      },
    }));

    (DataStore.observeQuery as jest.Mock).mockImplementation(fakeDataStoreObserveQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreCollection({
        model: fakeModel,
      }),
    );

    // Trigger fetch
    await waitForNextUpdate();

    // Check if error is set and loading state is back to normal
    expect(result.current.error).toBe(fakeError);
    expect(result.current.isLoading).toBe(false);

    // Finally, check returned items
    expect(result.current.items).toHaveLength(0);
  });

  it('should return items on success', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fakeItems = Array.from({ length: 100 }).map((_) => fakeItem);

    const namePredicateObject = {
      field: 'name',
      operator: 'eq',
      operand: 'fake-value',
    };
    const predicate = createDataStorePredicate<Todo>(namePredicateObject);

    const fakeDataStoreObserveQuery = jest.fn(() => ({
      subscribe: (onSuccess: Callback) => {
        setTimeout(() => onSuccess({ items: fakeItems }), 500);
        return { unsubscribe: () => {} };
      },
    }));

    (DataStore.observeQuery as jest.Mock).mockImplementation(fakeDataStoreObserveQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreCollection({
        model: fakeModel,
        criteria: predicate,
        pagination: fakePagination,
      }),
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.items).toBe(fakeItems);
  });

  it('should unsubscribe on unmount', () => {
    const unsubscribe = jest.fn();

    const fakeDataStoreObserveQuery = jest.fn(() => ({
      subscribe: () => ({ unsubscribe }),
    }));

    (DataStore.observeQuery as jest.Mock).mockImplementation(fakeDataStoreObserveQuery);

    const { unmount } = renderHook(() =>
      useDataStoreCollection({
        model: fakeModel,
      }),
    );

    // Force component unmount
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should only call DataStore.observeQuery once', () => {
    const unsubscribe = jest.fn();
    const fakeDataStoreObserveQuery = jest.fn(() => ({
      subscribe: () => ({ unsubscribe }),
    }));

    (DataStore.observeQuery as jest.Mock).mockImplementation(fakeDataStoreObserveQuery);

    const { rerender } = renderHook((params) => useDataStoreCollection(params), {
      initialProps: {
        model: fakeModel,
      },
    });

    expect(DataStore.observeQuery).toHaveBeenCalledTimes(1);

    rerender({ model: nextFakeModel });

    expect(DataStore.observeQuery).toHaveBeenCalledTimes(1);
  });
});

describe('useDataStoreItem', () => {
  afterEach(() => jest.clearAllMocks());

  it('should return default values while data is being fetched', async () => {
    (DataStore.query as jest.Mock).mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreItem({
        model: fakeModel,
        id: fakeId,
      }),
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.item).toBeUndefined();
    expect(result.current.error).toBeUndefined();

    await waitForNextUpdate();
  });

  it('should set error if DataStore.query throws an error', async () => {
    const fakeError = new Error('Unexpected DataStore error');
    const fakeDataStoreQuery = jest.fn(() => Promise.reject(fakeError));

    (DataStore.query as jest.Mock).mockImplementation(fakeDataStoreQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreItem({
        model: fakeModel,
        id: fakeId,
      }),
    );

    // Trigger fetch
    await waitForNextUpdate();

    // Check if error is set and loading state is back to normal
    expect(result.current.error).toBe(fakeError);
    expect(result.current.isLoading).toBe(false);

    // Finally, check returned item
    expect(result.current.item).toBeUndefined();
  });

  it('should return item on success', async () => {
    const fakeDataStoreQuery = jest.fn(() => Promise.resolve(fakeItem));
    (DataStore.query as jest.Mock).mockImplementation(fakeDataStoreQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreItem({
        model: fakeModel,
        id: fakeId,
      }),
    );

    // Check if DataStore.query was invoked with expected parameters
    expect(fakeDataStoreQuery).toHaveBeenCalledWith(fakeModel, fakeId);

    // Trigger fetch
    await waitForNextUpdate();

    // Check if there's no errors and loading state is back to normal
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);

    // Finally, check returned item
    expect(result.current.item).toBe(fakeItem);
  });

  it('should only call DataStore.query once', async () => {
    const fakeDataStoreQuery = jest.fn(() => Promise.resolve(fakeItem));
    (DataStore.query as jest.Mock).mockImplementation(fakeDataStoreQuery);

    const { rerender, waitForNextUpdate } = renderHook((props) => useDataStoreItem(props), {
      initialProps: {
        model: fakeModel,
        id: fakeId,
      },
    });

    // await fetch
    await waitForNextUpdate();

    expect(DataStore.query).toHaveBeenCalledTimes(1);

    rerender({ model: nextFakeModel, id: fakeId });

    expect(DataStore.query).toHaveBeenCalledTimes(1);
  });
});

describe('useDataStoreBinding', () => {
  afterEach(() => jest.clearAllMocks());

  it('handles calls with type record in the happy path', async () => {
    const fakeDataStoreQuery = jest.fn(() => Promise.resolve(fakeItem));
    (DataStore.query as jest.Mock).mockImplementation(fakeDataStoreQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreBinding({
        model: fakeModel,
        id: fakeId,
        type: 'record',
      }),
    );

    // Check if DataStore.query was invoked with expected parameters
    expect(fakeDataStoreQuery).toHaveBeenCalledWith(fakeModel, fakeId);

    // Trigger fetch
    await waitForNextUpdate();

    // Check if there's no errors and loading state is back to normal
    expect(result.current.error).toBeUndefined();
    expect(result.current.isLoading).toBe(false);

    // Finally, check returned item
    expect(result.current.item).toBe(fakeItem);
  });

  it('handles calls with type collection in the happy path', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const fakeItems = Array.from({ length: 100 }).map((_) => fakeItem);

    const namePredicateObject = {
      field: 'name',
      operator: 'eq',
      operand: 'fake-value',
    };
    const predicate = createDataStorePredicate<Todo>(namePredicateObject);

    const fakeDataStoreObserveQuery = jest.fn(() => ({
      subscribe: (onSuccess: Callback) => {
        setTimeout(() => onSuccess({ items: fakeItems }), 500);
        return { unsubscribe: () => {} };
      },
    }));

    (DataStore.observeQuery as jest.Mock).mockImplementation(fakeDataStoreObserveQuery);

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataStoreBinding({
        model: Todo,
        criteria: predicate,
        pagination: fakePagination,
        type: 'collection',
      }),
    );

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.items).toBe(fakeItems);
  });
});
