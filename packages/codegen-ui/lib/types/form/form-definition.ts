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
import { StudioFormStyle } from './style';

export type FormDefinitionElementProps = {
  isReadOnly?: boolean;
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  level?: number;
  text?: string;
};

export type FormDefinition = {
  form: {
    props: {
      layoutStyle: StudioFormStyle;
    };
  };
  elements: { [element: string]: { componentType: string; dataType?: string; props: FormDefinitionElementProps } };
  buttons: { [key: string]: string };
  elementMatrix: string[][];
};
