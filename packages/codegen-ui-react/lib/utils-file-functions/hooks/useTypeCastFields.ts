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
export const useTypeCastFieldsString = `export const useTypeCastFields = <Model extends PersistentModel>({
  fields,
  modelName,
  schema,
}: UseTypeCastFieldsProps): UseTypeCastFieldsReturn<Model> => {
  return React.useMemo(() => {
    if (!schema) {
      return fields;
    }

    const castFields: any = {};
    Object.keys(fields).forEach((fieldName: string) => {
      const field = fields[fieldName];
      switch (schema?.models[modelName]?.fields?.[fieldName]?.type) {
        case 'AWSTimestamp':
          castFields[fieldName] = Number(field);
          break;
        case 'Boolean':
          castFields[fieldName] = Boolean(field);
          break;
        case 'Int':
          castFields[fieldName] = (
            typeof field === 'string' ||
            (typeof field === 'object' &&
              Object.prototype.toString.call(field) === '[object String]')
          ) ? parseInt(field) : field;
          break;
        case 'Float':
          castFields[fieldName] = Number(field);
          break;
        default:
          castFields[fieldName] = field;
          break;
      }
    });

    return castFields;
  }, [fields, schema, modelName]);
};`;
