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

import {
  ACTION_DATASTORE_DELETE_FINISHED,
  ACTION_DATASTORE_DELETE_STARTED,
  EVENT_ACTION_DATASTORE_DELETE,
  UI_CHANNEL,
} from '../constants';
import { useDataStoreDeleteAction } from '../useDataStoreDeleteAction';
import { Todo } from './test-models/models';
import { AMPLIFY_SYMBOL } from '../../amplify-symbol';

jest.mock('aws-amplify');

const deleteSpy = jest.spyOn(DataStore, 'delete');
const hubDispatchSpy = jest.spyOn(Hub, 'dispatch');

const id = '1234';
const dataStoreDeleteArgs = {
  model: Todo,
  id,
};

describe('useDataStoreDeleteAction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call DataStore.delete', async () => {
    const action = useDataStoreDeleteAction(dataStoreDeleteArgs);

    await action();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should call Hub with started and finished events', async () => {
    const action = useDataStoreDeleteAction(dataStoreDeleteArgs);

    await action();
    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id },
        event: ACTION_DATASTORE_DELETE_STARTED,
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id },
        event: ACTION_DATASTORE_DELETE_FINISHED,
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL,
    );
  });

  it('should call Hub with error message if DataStore.delete rejects', async () => {
    const errorMessage = 'Invalid data model';
    deleteSpy.mockImplementation(() => Promise.reject(new Error(errorMessage)));

    const action = useDataStoreDeleteAction(dataStoreDeleteArgs);

    await action();

    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { id },
        event: ACTION_DATASTORE_DELETE_STARTED,
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: {
          id,
          errorMessage,
        },
        event: ACTION_DATASTORE_DELETE_FINISHED,
      },
      EVENT_ACTION_DATASTORE_DELETE,
      AMPLIFY_SYMBOL,
    );
  });
});
