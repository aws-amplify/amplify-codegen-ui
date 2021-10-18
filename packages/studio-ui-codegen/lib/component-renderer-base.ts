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
import { DividerProps, TextProps, ImageProps } from '@aws-amplify/ui-react';

import { CommonComponentRenderer } from './common-component-renderer';

type SourceProp = DividerProps | ImageProps | TextProps;

/**
 * This is a base class for a renderer that renders components with no children.
 */
export abstract class ComponentRendererBase<
  TPropIn extends SourceProp,
  TElementOut,
> extends CommonComponentRenderer<TPropIn> {
  abstract renderElement(): TElementOut;
}
