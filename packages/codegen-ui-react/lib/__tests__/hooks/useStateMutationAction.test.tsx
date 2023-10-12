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
import { Hub } from 'aws-amplify';
import { renderHook, act } from '@testing-library/react-hooks';

import {
  ACTION_STATE_MUTATION_FINISHED,
  ACTION_STATE_MUTATION_STARTED,
  EVENT_ACTION_CORE_STATE_MUTATION,
  UI_CHANNEL,
  useStateMutationAction,
  AMPLIFY_SYMBOL,
} from '../../utils-file-functions';

jest.mock('aws-amplify');

describe('useStateMutationAction:', () => {
  it('should update state correctly', () => {
    const prevState = 'none';
    const newState = 'block';
    const data = { prevState, newState };

    const { result } = renderHook(() => useStateMutationAction(prevState));
    act(() => {
      const [, setNewState] = result.current;
      setNewState(newState);
    });

    const [state] = result.current;
    expect(state).toBe(newState);

    expect(Hub.dispatch).toHaveBeenCalledTimes(2);
    expect(Hub.dispatch).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        event: ACTION_STATE_MUTATION_STARTED,
        data,
      },
      EVENT_ACTION_CORE_STATE_MUTATION,
      AMPLIFY_SYMBOL,
    );
    expect(Hub.dispatch).toHaveBeenLastCalledWith(
      UI_CHANNEL,
      {
        event: ACTION_STATE_MUTATION_FINISHED,
        data,
      },
      EVENT_ACTION_CORE_STATE_MUTATION,
      AMPLIFY_SYMBOL,
    );
  });
});
