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
import * as React from 'react';
import { Hub } from 'aws-amplify';
import { ACTION_NAVIGATE_FINISHED, ACTION_NAVIGATE_STARTED, EVENT_ACTION_CORE_NAVIGATE, UI_CHANNEL } from './constants';
import { AMPLIFY_SYMBOL } from '../amplify-symbol';

export type NavigateType = 'url' | 'anchor' | 'reload';

export interface UseNavigateActionOptions {
  type: NavigateType;

  url?: string;

  anchor?: string;

  target?: React.HTMLAttributeAnchorTarget;
}

export const windowFeatures = 'noopener noreferrer';
export const defaultTarget = '_self';

/**
 * Action to instruct user’s browser to change current location
 * @internal
 */
export const useNavigateAction = (options: UseNavigateActionOptions) => {
  const { type, url, anchor, target } = options;
  const run = React.useMemo(() => {
    switch (type) {
      case 'url':
        return () => {
          window.open(url, target || '_self', 'noopener noreferrer');
        };
      case 'anchor':
        return () => {
          window.location.hash = anchor ?? '';
        };
      case 'reload':
        return () => {
          window.location.reload();
        };
      default:
        return () => {
          // eslint-disable-next-line no-console
          console.warn('Please provide a valid navigate type. Available types are "url", "anchor" and "reload".');
        };
    }
  }, [anchor, target, type, url]);

  const navigateAction = () => {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_NAVIGATE_STARTED,
        data: options,
      },
      EVENT_ACTION_CORE_NAVIGATE,
      AMPLIFY_SYMBOL,
    );
    run();
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_NAVIGATE_FINISHED,
        data: options,
      },
      EVENT_ACTION_CORE_NAVIGATE,
      AMPLIFY_SYMBOL,
    );
  };

  return navigateAction;
};

export const useNavigateActionString = `export const useNavigateAction = (options: UseNavigateActionOptions) => {
  const { type, url, anchor, target } = options;
  const run = React.useMemo(() => {
    switch (type) {
      case 'url':
        return () => {
          window.open(url, target || '_self', 'noopener noreferrer');
        };
      case 'anchor':
        return () => {
          window.location.hash = anchor ?? '';
        };
      case 'reload':
        return () => {
          window.location.reload();
        };
      default:
        return () => {
          // eslint-disable-next-line no-console
          console.warn('Please provide a valid navigate type. Available types are "url", "anchor" and "reload".');
        };
    }
  }, [anchor, target, type, url]);

  const navigateAction = () => {
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_NAVIGATE_STARTED,
        data: options,
      },
      EVENT_ACTION_CORE_NAVIGATE,
      AMPLIFY_SYMBOL,
    );
    run();
    Hub.dispatch(
      UI_CHANNEL,
      {
        event: ACTION_NAVIGATE_FINISHED,
        data: options,
      },
      EVENT_ACTION_CORE_NAVIGATE,
      AMPLIFY_SYMBOL,
    );
  };

  return navigateAction;
};`;
