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
import ts, { factory } from 'typescript';
import { DateFormat, DateTimeFormat, TimeFormat } from '@aws-amplify/codegen-ui';

const monthToShortMon: { [mon: string]: string } = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

const invalidDateStr = 'Invalid Date';

type DateFormatType = {
  type: 'DateFormat';
  format: DateFormat['dateFormat'];
};

type DateTimeFormatType = {
  type: 'DateTimeFormat';
  format: DateTimeFormat['dateTimeFormat'];
};

type TimeFormatType = {
  type: 'TimeFormat';
  format: TimeFormat['timeFormat'];
};

type FormatInputType = DateFormatType | DateTimeFormatType | TimeFormatType;

export function formatDate(date: string, dateFormat: DateFormat['dateFormat']): string {
  if (date === undefined || date === null) {
    return date;
  }

  // AWSDate: YYYY-MM-DD (ISO 8601)
  const validDate = new Date(Date.parse(date));
  if (validDate.toString() === invalidDateStr) {
    return date;
  }

  const splitDate = date.split(/-|\+|Z/);

  const year = splitDate[0];
  const month = splitDate[1];
  const day = splitDate[2];

  // Remove leading zeroes
  const truncatedMonth = month.replace(/^0+/, '');

  switch (dateFormat) {
    case 'locale':
      return validDate.toLocaleDateString();
    case 'YYYY.MM.DD':
      return `${year}.${month}.${day}`;
    case 'DD.MM.YYYY':
      return `${day}.${month}.${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'Mmm DD, YYYY':
      return `${monthToShortMon[truncatedMonth]} ${day}, ${year}`;
    default:
      return date;
  }
}

export function formatTime(time: string, timeFormat: TimeFormat['timeFormat']): string {
  if (time === undefined || time === null) {
    return time;
  }

  // AWSTime: hh:mm:ss.sss (24hr format - ISO 8601)
  const splitTime = time.split(/:|Z/);

  if (splitTime.length < 3) {
    return time;
  }

  const validTime = new Date();
  validTime.setHours(Number.parseInt(splitTime[0], 10));
  validTime.setMinutes(Number.parseInt(splitTime[1], 10));

  const splitSeconds = splitTime[2].split('.');
  validTime.setSeconds(Number.parseInt(splitSeconds[0], 10), Number.parseInt(splitSeconds[1], 10));

  if (validTime.toString() === invalidDateStr) {
    return time;
  }

  switch (timeFormat) {
    case 'locale':
      return validTime.toLocaleTimeString();
    case 'hours24':
      return validTime.toLocaleTimeString('en-gb');
    case 'hours12':
      return validTime.toLocaleTimeString('en-us');
    default:
      return time;
  }
}

export function formatDateTime(dateTimeStr: string, dateTimeFormat: DateTimeFormat['dateTimeFormat']): string {
  if (dateTimeStr === undefined || dateTimeStr === null) {
    return dateTimeStr;
  }

  // AWSTimestamp: millis before or after 1970-01-01-T00:00*Z*
  // AWSDateTime: hh:mm:ss.sss (24hr format - ISO 8601)
  const dateTime = /^\d+$/.test(dateTimeStr)
    ? new Date(Number.parseInt(dateTimeStr, 10))
    : new Date(Date.parse(dateTimeStr));

  if (dateTime.toString() === invalidDateStr) {
    return dateTimeStr;
  }

  if (dateTimeFormat === 'locale') {
    return dateTime.toLocaleString();
  }
  const dateAndTime = dateTime.toISOString().split('T');
  const date = formatDate(dateAndTime[0], dateTimeFormat.dateFormat);
  const time = formatTime(dateAndTime[1], dateTimeFormat.timeFormat);

  return `${date} - ${time}`;
}

export function format(value: string, formatterInput: FormatInputType) {
  switch (formatterInput.type) {
    case 'DateFormat':
      return formatDate(value, formatterInput.format);
    case 'DateTimeFormat':
      return formatDateTime(value, formatterInput.format);
    case 'TimeFormat':
      return formatTime(value, formatterInput.format);
    default:
      return value;
  }
}

export const generateFormatUtil = () => [
  factory.createImportDeclaration(
    undefined,
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports([
        factory.createImportSpecifier(undefined, factory.createIdentifier('DateFormat')),
        factory.createImportSpecifier(undefined, factory.createIdentifier('DateTimeFormat')),
        factory.createImportSpecifier(undefined, factory.createIdentifier('TimeFormat')),
      ]),
    ),
    factory.createStringLiteral('@aws-amplify/codegen-ui'),
  ),
  factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('monthToShortMon'),
          undefined,
          factory.createTypeLiteralNode([
            factory.createIndexSignature(
              undefined,
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  undefined,
                  undefined,
                  factory.createIdentifier('mon'),
                  undefined,
                  factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                  undefined,
                ),
              ],
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
          ]),
          factory.createObjectLiteralExpression(
            [
              factory.createPropertyAssignment(factory.createStringLiteral('1'), factory.createStringLiteral('Jan')),
              factory.createPropertyAssignment(factory.createStringLiteral('2'), factory.createStringLiteral('Feb')),
              factory.createPropertyAssignment(factory.createStringLiteral('3'), factory.createStringLiteral('Mar')),
              factory.createPropertyAssignment(factory.createStringLiteral('4'), factory.createStringLiteral('Apr')),
              factory.createPropertyAssignment(factory.createStringLiteral('5'), factory.createStringLiteral('May')),
              factory.createPropertyAssignment(factory.createStringLiteral('6'), factory.createStringLiteral('Jun')),
              factory.createPropertyAssignment(factory.createStringLiteral('7'), factory.createStringLiteral('Jul')),
              factory.createPropertyAssignment(factory.createStringLiteral('8'), factory.createStringLiteral('Aug')),
              factory.createPropertyAssignment(factory.createStringLiteral('9'), factory.createStringLiteral('Sep')),
              factory.createPropertyAssignment(factory.createStringLiteral('10'), factory.createStringLiteral('Oct')),
              factory.createPropertyAssignment(factory.createStringLiteral('11'), factory.createStringLiteral('Nov')),
              factory.createPropertyAssignment(factory.createStringLiteral('12'), factory.createStringLiteral('Dec')),
            ],
            true,
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  ),
  factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('invalidDateStr'),
          undefined,
          undefined,
          factory.createStringLiteral('Invalid Date'),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    factory.createIdentifier('DateFormatType'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('type'),
        undefined,
        factory.createLiteralTypeNode(factory.createStringLiteral('DateFormat')),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('format'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('DateFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('dateFormat')),
        ),
      ),
    ]),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    factory.createIdentifier('DateTimeFormatType'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('type'),
        undefined,
        factory.createLiteralTypeNode(factory.createStringLiteral('DateTimeFormat')),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('format'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('DateTimeFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('dateTimeFormat')),
        ),
      ),
    ]),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    factory.createIdentifier('TimeFormatType'),
    undefined,
    factory.createTypeLiteralNode([
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('type'),
        undefined,
        factory.createLiteralTypeNode(factory.createStringLiteral('TimeFormat')),
      ),
      factory.createPropertySignature(
        undefined,
        factory.createIdentifier('format'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('TimeFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('timeFormat')),
        ),
      ),
    ]),
  ),
  factory.createTypeAliasDeclaration(
    undefined,
    undefined,
    factory.createIdentifier('FormatInputType'),
    undefined,
    factory.createUnionTypeNode([
      factory.createTypeReferenceNode(factory.createIdentifier('DateFormatType'), undefined),
      factory.createTypeReferenceNode(factory.createIdentifier('DateTimeFormatType'), undefined),
      factory.createTypeReferenceNode(factory.createIdentifier('TimeFormatType'), undefined),
    ]),
  ),
  factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier('formatDate'),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('date'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('dateFormat'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('DateFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('dateFormat')),
        ),
        undefined,
      ),
    ],
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createBlock(
      [
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createBinaryExpression(
              factory.createIdentifier('date'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createIdentifier('undefined'),
            ),
            factory.createToken(ts.SyntaxKind.BarBarToken),
            factory.createBinaryExpression(
              factory.createIdentifier('date'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createNull(),
            ),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('date'))], true),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('validDate'),
                undefined,
                undefined,
                factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createIdentifier('Date'),
                      factory.createIdentifier('parse'),
                    ),
                    undefined,
                    [factory.createIdentifier('date')],
                  ),
                ]),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('validDate'),
                factory.createIdentifier('toString'),
              ),
              undefined,
              [],
            ),
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            factory.createIdentifier('invalidDateStr'),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('date'))], true),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('splitDate'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('date'),
                    factory.createIdentifier('split'),
                  ),
                  undefined,
                  [factory.createRegularExpressionLiteral('/-|+|Z/')],
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('year'),
                undefined,
                undefined,
                factory.createElementAccessExpression(
                  factory.createIdentifier('splitDate'),
                  factory.createNumericLiteral('0'),
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('month'),
                undefined,
                undefined,
                factory.createElementAccessExpression(
                  factory.createIdentifier('splitDate'),
                  factory.createNumericLiteral('1'),
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('day'),
                undefined,
                undefined,
                factory.createElementAccessExpression(
                  factory.createIdentifier('splitDate'),
                  factory.createNumericLiteral('2'),
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('truncatedMonth'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('month'),
                    factory.createIdentifier('replace'),
                  ),
                  undefined,
                  [factory.createRegularExpressionLiteral('/^0+/'), factory.createStringLiteral('')],
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createSwitchStatement(
          factory.createIdentifier('dateFormat'),
          factory.createCaseBlock([
            factory.createCaseClause(factory.createStringLiteral('locale'), [
              factory.createReturnStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('validDate'),
                    factory.createIdentifier('toLocaleDateString'),
                  ),
                  undefined,
                  [],
                ),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('YYYY.MM.DD'), [
              factory.createReturnStatement(
                factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                  factory.createTemplateSpan(factory.createIdentifier('year'), factory.createTemplateMiddle('.', '.')),
                  factory.createTemplateSpan(factory.createIdentifier('month'), factory.createTemplateMiddle('.', '.')),
                  factory.createTemplateSpan(factory.createIdentifier('day'), factory.createTemplateTail('', '')),
                ]),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('DD.MM.YYYY'), [
              factory.createReturnStatement(
                factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                  factory.createTemplateSpan(factory.createIdentifier('day'), factory.createTemplateMiddle('.', '.')),
                  factory.createTemplateSpan(factory.createIdentifier('month'), factory.createTemplateMiddle('.', '.')),
                  factory.createTemplateSpan(factory.createIdentifier('year'), factory.createTemplateTail('', '')),
                ]),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('MM/DD/YYYY'), [
              factory.createReturnStatement(
                factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                  factory.createTemplateSpan(factory.createIdentifier('month'), factory.createTemplateMiddle('/', '/')),
                  factory.createTemplateSpan(factory.createIdentifier('day'), factory.createTemplateMiddle('/', '/')),
                  factory.createTemplateSpan(factory.createIdentifier('year'), factory.createTemplateTail('', '')),
                ]),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('Mmm DD, YYYY'), [
              factory.createReturnStatement(
                factory.createTemplateExpression(factory.createTemplateHead('', ''), [
                  factory.createTemplateSpan(
                    factory.createElementAccessExpression(
                      factory.createIdentifier('monthToShortMon'),
                      factory.createIdentifier('truncatedMonth'),
                    ),
                    factory.createTemplateMiddle(' ', ' '),
                  ),
                  factory.createTemplateSpan(factory.createIdentifier('day'), factory.createTemplateMiddle(', ', ', ')),
                  factory.createTemplateSpan(factory.createIdentifier('year'), factory.createTemplateTail('', '')),
                ]),
              ),
            ]),
            factory.createDefaultClause([factory.createReturnStatement(factory.createIdentifier('date'))]),
          ]),
        ),
      ],
      true,
    ),
  ),
  factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier('formatTime'),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('time'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('timeFormat'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('TimeFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('timeFormat')),
        ),
        undefined,
      ),
    ],
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createBlock(
      [
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createBinaryExpression(
              factory.createIdentifier('time'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createIdentifier('undefined'),
            ),
            factory.createToken(ts.SyntaxKind.BarBarToken),
            factory.createBinaryExpression(
              factory.createIdentifier('time'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createNull(),
            ),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('time'))], true),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('splitTime'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('time'),
                    factory.createIdentifier('split'),
                  ),
                  undefined,
                  [factory.createRegularExpressionLiteral('/:|Z/')],
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('splitTime'),
              factory.createIdentifier('length'),
            ),
            factory.createToken(ts.SyntaxKind.LessThanToken),
            factory.createNumericLiteral('3'),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('time'))], true),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('validTime'),
                undefined,
                undefined,
                factory.createNewExpression(factory.createIdentifier('Date'), undefined, []),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('validTime'),
              factory.createIdentifier('setHours'),
            ),
            undefined,
            [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Number'),
                  factory.createIdentifier('parseInt'),
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('splitTime'),
                    factory.createNumericLiteral('0'),
                  ),
                  factory.createNumericLiteral('10'),
                ],
              ),
            ],
          ),
        ),
        factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('validTime'),
              factory.createIdentifier('setMinutes'),
            ),
            undefined,
            [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Number'),
                  factory.createIdentifier('parseInt'),
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('splitTime'),
                    factory.createNumericLiteral('1'),
                  ),
                  factory.createNumericLiteral('10'),
                ],
              ),
            ],
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('splitSeconds'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createElementAccessExpression(
                      factory.createIdentifier('splitTime'),
                      factory.createNumericLiteral('2'),
                    ),
                    factory.createIdentifier('split'),
                  ),
                  undefined,
                  [factory.createStringLiteral('.')],
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createExpressionStatement(
          factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createIdentifier('validTime'),
              factory.createIdentifier('setSeconds'),
            ),
            undefined,
            [
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Number'),
                  factory.createIdentifier('parseInt'),
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('splitSeconds'),
                    factory.createNumericLiteral('0'),
                  ),
                  factory.createNumericLiteral('10'),
                ],
              ),
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createIdentifier('Number'),
                  factory.createIdentifier('parseInt'),
                ),
                undefined,
                [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('splitSeconds'),
                    factory.createNumericLiteral('1'),
                  ),
                  factory.createNumericLiteral('10'),
                ],
              ),
            ],
          ),
        ),
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('validTime'),
                factory.createIdentifier('toString'),
              ),
              undefined,
              [],
            ),
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            factory.createIdentifier('invalidDateStr'),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('time'))], true),
          undefined,
        ),
        factory.createSwitchStatement(
          factory.createIdentifier('timeFormat'),
          factory.createCaseBlock([
            factory.createCaseClause(factory.createStringLiteral('locale'), [
              factory.createReturnStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('validTime'),
                    factory.createIdentifier('toLocaleTimeString'),
                  ),
                  undefined,
                  [],
                ),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('hours24'), [
              factory.createReturnStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('validTime'),
                    factory.createIdentifier('toLocaleTimeString'),
                  ),
                  undefined,
                  [factory.createStringLiteral('en-gb')],
                ),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('hours12'), [
              factory.createReturnStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('validTime'),
                    factory.createIdentifier('toLocaleTimeString'),
                  ),
                  undefined,
                  [factory.createStringLiteral('en-us')],
                ),
              ),
            ]),
            factory.createDefaultClause([factory.createReturnStatement(factory.createIdentifier('time'))]),
          ]),
        ),
      ],
      true,
    ),
  ),
  factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier('formatDateTime'),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('dateTimeStr'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('dateTimeFormat'),
        undefined,
        factory.createIndexedAccessTypeNode(
          factory.createTypeReferenceNode(factory.createIdentifier('DateTimeFormat'), undefined),
          factory.createLiteralTypeNode(factory.createStringLiteral('dateTimeFormat')),
        ),
        undefined,
      ),
    ],
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createBlock(
      [
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createBinaryExpression(
              factory.createIdentifier('dateTimeStr'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createIdentifier('undefined'),
            ),
            factory.createToken(ts.SyntaxKind.BarBarToken),
            factory.createBinaryExpression(
              factory.createIdentifier('dateTimeStr'),
              factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
              factory.createNull(),
            ),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('dateTimeStr'))], true),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('dateTime'),
                undefined,
                undefined,
                factory.createConditionalExpression(
                  factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createRegularExpressionLiteral('/^d+$/'),
                      factory.createIdentifier('test'),
                    ),
                    undefined,
                    [factory.createIdentifier('dateTimeStr')],
                  ),
                  factory.createToken(ts.SyntaxKind.QuestionToken),
                  factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Number'),
                        factory.createIdentifier('parseInt'),
                      ),
                      undefined,
                      [factory.createIdentifier('dateTimeStr'), factory.createNumericLiteral('10')],
                    ),
                  ]),
                  factory.createToken(ts.SyntaxKind.ColonToken),
                  factory.createNewExpression(factory.createIdentifier('Date'), undefined, [
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('Date'),
                        factory.createIdentifier('parse'),
                      ),
                      undefined,
                      [factory.createIdentifier('dateTimeStr')],
                    ),
                  ]),
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('dateTime'),
                factory.createIdentifier('toString'),
              ),
              undefined,
              [],
            ),
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            factory.createIdentifier('invalidDateStr'),
          ),
          factory.createBlock([factory.createReturnStatement(factory.createIdentifier('dateTimeStr'))], true),
          undefined,
        ),
        factory.createIfStatement(
          factory.createBinaryExpression(
            factory.createIdentifier('dateTimeFormat'),
            factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
            factory.createStringLiteral('locale'),
          ),
          factory.createBlock(
            [
              factory.createReturnStatement(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('dateTime'),
                    factory.createIdentifier('toLocaleString'),
                  ),
                  undefined,
                  [],
                ),
              ),
            ],
            true,
          ),
          undefined,
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('dateAndTime'),
                undefined,
                undefined,
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createIdentifier('dateTime'),
                        factory.createIdentifier('toISOString'),
                      ),
                      undefined,
                      [],
                    ),
                    factory.createIdentifier('split'),
                  ),
                  undefined,
                  [factory.createStringLiteral('T')],
                ),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('date'),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('formatDate'), undefined, [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('dateAndTime'),
                    factory.createNumericLiteral('0'),
                  ),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('dateTimeFormat'),
                    factory.createIdentifier('dateFormat'),
                  ),
                ]),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createVariableStatement(
          undefined,
          factory.createVariableDeclarationList(
            [
              factory.createVariableDeclaration(
                factory.createIdentifier('time'),
                undefined,
                undefined,
                factory.createCallExpression(factory.createIdentifier('formatTime'), undefined, [
                  factory.createElementAccessExpression(
                    factory.createIdentifier('dateAndTime'),
                    factory.createNumericLiteral('1'),
                  ),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('dateTimeFormat'),
                    factory.createIdentifier('timeFormat'),
                  ),
                ]),
              ),
            ],
            ts.NodeFlags.Const,
          ),
        ),
        factory.createReturnStatement(
          factory.createTemplateExpression(factory.createTemplateHead('', ''), [
            factory.createTemplateSpan(factory.createIdentifier('date'), factory.createTemplateMiddle(' - ', ' - ')),
            factory.createTemplateSpan(factory.createIdentifier('time'), factory.createTemplateTail('', '')),
          ]),
        ),
      ],
      true,
    ),
  ),
  factory.createFunctionDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    undefined,
    factory.createIdentifier('format'),
    undefined,
    [
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('value'),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined,
      ),
      factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier('formatterInput'),
        undefined,
        factory.createTypeReferenceNode(factory.createIdentifier('FormatInputType'), undefined),
        undefined,
      ),
    ],
    undefined,
    factory.createBlock(
      [
        factory.createSwitchStatement(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('formatterInput'),
            factory.createIdentifier('type'),
          ),
          factory.createCaseBlock([
            factory.createCaseClause(factory.createStringLiteral('DateFormat'), [
              factory.createReturnStatement(
                factory.createCallExpression(factory.createIdentifier('formatDate'), undefined, [
                  factory.createIdentifier('value'),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('formatterInput'),
                    factory.createIdentifier('format'),
                  ),
                ]),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('DateTimeFormat'), [
              factory.createReturnStatement(
                factory.createCallExpression(factory.createIdentifier('formatDateTime'), undefined, [
                  factory.createIdentifier('value'),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('formatterInput'),
                    factory.createIdentifier('format'),
                  ),
                ]),
              ),
            ]),
            factory.createCaseClause(factory.createStringLiteral('TimeFormat'), [
              factory.createReturnStatement(
                factory.createCallExpression(factory.createIdentifier('formatTime'), undefined, [
                  factory.createIdentifier('value'),
                  factory.createPropertyAccessExpression(
                    factory.createIdentifier('formatterInput'),
                    factory.createIdentifier('format'),
                  ),
                ]),
              ),
            ]),
            factory.createDefaultClause([factory.createReturnStatement(factory.createIdentifier('value'))]),
          ]),
        ),
      ],
      true,
    ),
  ),
];
