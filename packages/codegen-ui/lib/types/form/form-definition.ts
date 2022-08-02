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
import { FormDefinitionElement } from './form-definition-element';
import { StudioGenericFieldConfig } from './fields';
import { StudioFormCTAConfig } from './form-cta';

export type ModelFieldsConfigs = { [key: string]: StudioGenericFieldConfig };

export type FormDefinition = {
  form: {
    layoutStyle: StudioFormStyle;
  };
  elements: { [element: string]: FormDefinitionElement };
  buttons: StudioFormCTAConfig;
  elementMatrix: string[][];
  inputFields?: string[];
};

export type FieldTypeMapKeys =
  | 'ID'
  | 'String'
  | 'Int'
  | 'Float'
  | 'AWSDate'
  | 'AWSTime'
  | 'AWSDateTime'
  | 'AWSTimestamp'
  | 'AWSEmail'
  | 'AWSURL'
  | 'AWSIPAddress'
  | 'Boolean'
  | 'AWSJSON'
  | 'AWSPhone'
  | 'Enum'
  | 'Relationship'
  | 'NonModel';
