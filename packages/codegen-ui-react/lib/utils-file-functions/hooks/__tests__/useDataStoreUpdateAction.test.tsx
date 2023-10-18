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
import { DataStore, Hub } from 'aws-amplify';
import { renderHook } from '@testing-library/react-hooks';

import {
  ACTION_DATASTORE_UPDATE_FINISHED,
  ACTION_DATASTORE_UPDATE_STARTED,
  EVENT_ACTION_DATASTORE_UPDATE,
  UI_CHANNEL,
} from '../constants';
import { useDataStoreUpdateAction } from '../useDataStoreUpdateAction';
import { AMPLIFY_SYMBOL } from '../../amplify-symbol';
import { Todo } from './test-models/models';

jest.mock('aws-amplify');

const name = 'milk';
const id = '1234';
const updateActionArgs = {
  model: Todo,
  id,
  fields: { name },
};

const saveSpy = jest.spyOn(DataStore, 'save');
const querySpy = jest.spyOn(DataStore, 'query').mockImplementation(() => Promise.resolve([{ id, name }]));
const hubDispatchSpy = jest.spyOn(Hub, 'dispatch');

describe('useAuthSignOutAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call DataStore.save', async () => {
    const {
      result: { current: action },
    } = renderHook(() => useDataStoreUpdateAction(updateActionArgs));

    await action();
    expect(querySpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  it('should call Hub with started and finished events', async () => {
    const {
      result: { current: action },
    } = renderHook(() => useDataStoreUpdateAction(updateActionArgs));

    await action();
    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id, fields: { name } },
        event: ACTION_DATASTORE_UPDATE_STARTED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id, fields: { name } },
        event: ACTION_DATASTORE_UPDATE_FINISHED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
  });

  it('should call Hub with error message if DataStore.save rejects', async () => {
    const errorMessage = 'Invalid data model';
    saveSpy.mockImplementation(() => Promise.reject(new Error(errorMessage)));
    querySpy.mockImplementation(() => Promise.resolve([{ id, name }]));
    const {
      result: { current: action },
    } = renderHook(() => useDataStoreUpdateAction(updateActionArgs));

    await action();

    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id, fields: { name } },
        event: ACTION_DATASTORE_UPDATE_STARTED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: {
          id,
          fields: { name },
          errorMessage,
        },
        event: ACTION_DATASTORE_UPDATE_FINISHED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
  });

  it('when original not found, should call Hub with error message', async () => {
    const {
      result: { current: action },
    } = renderHook(() => useDataStoreUpdateAction(updateActionArgs));
    querySpy.mockImplementationOnce(
      () => Promise.resolve(undefined) as unknown as ReturnType<typeof DataStore['query']>,
    );

    await action();
    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id, fields: { name } },
        event: ACTION_DATASTORE_UPDATE_STARTED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: {
          id,
          fields: { name },
          errorMessage: `Error querying datastore item by id: ${id}`,
        },
        event: ACTION_DATASTORE_UPDATE_FINISHED,
      },
      EVENT_ACTION_DATASTORE_UPDATE,
      AMPLIFY_SYMBOL,
    );
  });
});
