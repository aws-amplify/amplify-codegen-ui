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
import { BadgeProps, ButtonProps, FlexProps, CardProps, ViewProps as BoxProps } from '@aws-amplify/ui-react';

import { FrontendManagerComponentChild } from './types';
import { CommonComponentRenderer } from './common-component-renderer';

type SourceProp = BoxProps | BadgeProps | ButtonProps | CardProps | FlexProps;

export abstract class ComponentWithChildrenRendererBase<
  TPropIn extends SourceProp,
  TElementOut,
  TElementChild,
> extends CommonComponentRenderer<TPropIn> {
  abstract renderElement(
    renderChildren: (children: FrontendManagerComponentChild[], component?: TElementOut) => TElementChild[],
  ): TElementOut;
}
