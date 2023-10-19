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
import { Hub, Auth } from 'aws-amplify';
import { AMPLIFY_SYMBOL } from '../amplify-symbol';
import { getErrorMessage } from '../get-error-message';
import {
  UI_CHANNEL,
  ACTION_AUTH_SIGNOUT_STARTED,
  EVENT_ACTION_AUTH_SIGNOUT,
  ACTION_AUTH_SIGNOUT_FINISHED,
} from './constants';

export type SignOutOptions = Parameters<typeof Auth['signOut']>[0];

export interface UseAuthSignOutAction {
  (options?: SignOutOptions): () => Promise<void>;
}

export const useAuthSignOutAction: UseAuthSignOutAction = (options) => async () => {
  try {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_AUTH_SIGNOUT_STARTED,
        data: { options },
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );

    await Auth.signOut(options);
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_AUTH_SIGNOUT_FINISHED,
        data: { options },
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
  } catch (error) {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_AUTH_SIGNOUT_FINISHED,
        data: { options, errorMessage: getErrorMessage(error) },
      },
      EVENT_ACTION_AUTH_SIGNOUT,
      AMPLIFY_SYMBOL,
    );
  }
};

export const useAuthSignOutActionString = `export const useAuthSignOutAction: UseAuthSignOutAction =
  (options) => async () => {
    try {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_AUTH_SIGNOUT_STARTED,
          data: { options },
        },
        EVENT_ACTION_AUTH_SIGNOUT,
        AMPLIFY_SYMBOL
      );

      await Auth.signOut(options);
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_AUTH_SIGNOUT_FINISHED,
          data: { options },
        },
        EVENT_ACTION_AUTH_SIGNOUT,
        AMPLIFY_SYMBOL
      );
    } catch (error) {
      Hub.dispatch(
        UI_CHANNEL,
        {
          event: ACTION_AUTH_SIGNOUT_FINISHED,
          data: { options, errorMessage: getErrorMessage(error) },
        },
        EVENT_ACTION_AUTH_SIGNOUT,
        AMPLIFY_SYMBOL
      );
    }
  };`;
