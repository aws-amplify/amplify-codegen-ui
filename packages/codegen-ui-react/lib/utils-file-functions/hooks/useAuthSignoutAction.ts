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

export const useAuthSignOutActionStringV6 = `export const useAuthSignOutAction: UseAuthSignOutAction =
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

      await signOut(options);
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
