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
import { Auth, Hub } from 'aws-amplify';
import {
  ACTION_AUTH_SIGNOUT_FINISHED,
  ACTION_AUTH_SIGNOUT_STARTED,
  EVENT_ACTION_AUTH_SIGNOUT,
  UI_CHANNEL,
} from '../constants';
import { AMPLIFY_SYMBOL } from '../../amplify-symbol';
import { useAuthSignOutAction } from '../useAuthSignoutAction';

jest.mock('aws-amplify');

const signOutSpy = jest.spyOn(Auth, 'signOut');
const hubDispatchSpy = jest.spyOn(Hub, 'dispatch');

describe('useAuthSignOutAction', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call Auth.SignOut', async () => {
    const authSignOutAction = useAuthSignOutAction();

    await authSignOutAction();
    expect(signOutSpy).toHaveBeenCalledTimes(1);
  });

  it('should call Hub with started and finished events', async () => {
    const authSignOutAction = useAuthSignOutAction();

    await authSignOutAction();
    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { options: undefined },
        event: ACTION_AUTH_SIGNOUT_STARTED,
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { options: undefined },
        event: ACTION_AUTH_SIGNOUT_FINISHED,
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
  });

  it('should call Hub with started and finished events with options', async () => {
    const authSignOutAction = useAuthSignOutAction({ global: true });

    await authSignOutAction();
    expect(hubDispatchSpy).toHaveBeenCalledTimes(2);
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { options: { global: true } },
        event: ACTION_AUTH_SIGNOUT_STARTED,
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
    expect(hubDispatchSpy).toHaveBeenCalledWith(
      UI_CHANNEL,
      {
        data: { options: { global: true } },
        event: ACTION_AUTH_SIGNOUT_FINISHED,
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
  });
});
