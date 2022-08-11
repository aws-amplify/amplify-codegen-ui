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
import { ColumnInfo, StringFormat, StudioView, TableDefinition, ViewMetadata } from '@aws-amplify/codegen-ui';
import {
  factory,
  Identifier,
  JsxAttribute,
  JsxAttributes,
  JsxChild,
  JsxElement,
  JsxExpression,
  JsxOpeningElement,
  ObjectLiteralExpression,
  SyntaxKind,
} from 'typescript';
import { ImportCollection, ImportSource } from './imports';
import { Primitive } from './primitive';
import { objectToExpression, stringFormatToType } from './react-table-renderer-helper';

export class ReactTableRenderer {
  private requiredUIReactImports = [
    Primitive.Table,
    Primitive.TableHead,
    Primitive.TableBody,
    Primitive.TableRow,
    Primitive.TableCell,
    Primitive.TableFoot,
  ];

  protected viewDefinition: TableDefinition;

  protected viewComponent: StudioView;

  protected viewMetadata: ViewMetadata;

  constructor(view: StudioView, definition: TableDefinition, metadata: ViewMetadata, imports: ImportCollection) {
    this.viewComponent = view;
    this.viewDefinition = definition;
    this.viewMetadata = metadata;
    this.viewMetadata.tableFieldFormatting = {};

    this.viewDefinition.columns.forEach((column) => {
      if (column.valueFormatting) {
        this.viewMetadata.tableFieldFormatting![column.header] = { ...column.valueFormatting };
      }
    });

    this.requiredUIReactImports.forEach((importName) => {
      imports.addImport(ImportSource.UI_REACT, importName);
    });
  }

  createOpeningTableElement(): JsxOpeningElement {
    const tableAttributes: JsxAttribute[] = [];

    if (this.viewDefinition.tableConfig.highlightOnHover) {
      tableAttributes.push(
        factory.createJsxAttribute(
          factory.createIdentifier('highlightOnHover'),
          factory.createJsxExpression(undefined, factory.createIdentifier('highlightOnHover')),
        ),
      );
    }

    return factory.createJsxOpeningElement(
      factory.createIdentifier(Primitive.Table),
      undefined,
      factory.createJsxAttributes(tableAttributes),
    );
  }

  createTableRow(children: JsxChild[], attributes: JsxAttributes): JsxElement {
    return factory.createJsxElement(
      factory.createJsxOpeningElement(factory.createIdentifier(Primitive.TableRow), undefined, attributes),
      children,
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.TableRow)),
    );
  }

  createTableHeadRow(): JsxChild {
    const cellsInHeader: JsxChild[] = this.viewDefinition.columns.map((column) => {
      return factory.createJsxElement(
        factory.createJsxOpeningElement(
          factory.createIdentifier(Primitive.TableCell),
          undefined,
          factory.createJsxAttributes([
            factory.createJsxAttribute(factory.createIdentifier('as'), factory.createStringLiteral('th')),
          ]),
        ),
        [factory.createJsxText(column.label ?? column.header, false)],
        factory.createJsxClosingElement(factory.createIdentifier(Primitive.TableCell)),
      );
    });

    return this.createTableRow(cellsInHeader, factory.createJsxAttributes([]));
  }

  createTableHeadElement(): JsxElement {
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier(Primitive.TableHead),
        undefined,
        factory.createJsxAttributes([]),
      ),
      [this.createTableHeadRow()],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.TableHead)),
    );
  }

  createTableHeadElementBlock(): JsxExpression {
    return factory.createJsxExpression(
      undefined,
      factory.createBinaryExpression(
        factory.createPrefixUnaryExpression(SyntaxKind.ExclamationToken, factory.createIdentifier('disableHeaders')),
        SyntaxKind.AmpersandAmpersandToken,
        this.createTableHeadElement(),
      ),
    );
  }

  createRowOnClickCBAttr(): JsxAttributes {
    return factory.createJsxAttributes([
      factory.createJsxAttribute(
        factory.createIdentifier('onClick'),
        factory.createJsxExpression(
          undefined,
          factory.createConditionalExpression(
            factory.createIdentifier('onRowClick'),
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createArrowFunction(
              undefined,
              undefined,
              [],
              undefined,
              factory.createToken(SyntaxKind.EqualsGreaterThanToken),
              factory.createCallExpression(factory.createIdentifier('onRowClick'), undefined, [
                factory.createIdentifier('item'),
                factory.createIdentifier('index'),
              ]),
            ),
            factory.createToken(SyntaxKind.ColonToken),
            factory.createNull(),
          ),
        ),
      ),
    ]);
  }

  generateFormatLiteralExpression(field: string): ObjectLiteralExpression | Identifier {
    const formatting = this.viewMetadata.tableFieldFormatting;

    if (formatting?.[field]) {
      return objectToExpression(formatting[field].stringFormat);
    }
    return factory.createIdentifier('undefined');
  }

  /*  Expected arg shape examples:
      For dateTime:
      {
        type: 'DateTimeFormat'
        format: {
          dateFormat: 'locale',
          timeFormat: 'hours24',
        }
      }
      For date:
      {
        type: 'DateFormat'
        format: {
          dateFormat: 'Mmm, DD YYYY',
        }
      }
  */
  createFormatArg(field: string) {
    const format = this.viewMetadata.tableFieldFormatting?.[field];

    const type: StringFormat['type'] | undefined = stringFormatToType(format);

    if (format && type) {
      return factory.createObjectLiteralExpression([
        factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createStringLiteral(type)),
        factory.createPropertyAssignment(
          factory.createIdentifier('format'),
          this.generateFormatLiteralExpression(field),
        ),
      ]);
    }
    return factory.createIdentifier('undefined');
  }

  createTableBodyCellFromColumn(column: ColumnInfo): JsxElement {
    const columnId = column.header;

    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier(Primitive.TableCell),
        undefined,
        factory.createJsxAttributes([]),
      ),
      [
        factory.createJsxExpression(
          undefined,
          factory.createConditionalExpression(
            factory.createPropertyAccessChain(
              factory.createIdentifier('format'),
              factory.createToken(SyntaxKind.QuestionDotToken),
              factory.createIdentifier(columnId),
            ),
            factory.createToken(SyntaxKind.QuestionToken),
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createIdentifier('format'),
                factory.createIdentifier(columnId),
              ),
              undefined,
              [
                factory.createPropertyAccessChain(
                  factory.createIdentifier('item'),
                  factory.createToken(SyntaxKind.QuestionDotToken),
                  factory.createIdentifier(columnId),
                ),
              ],
            ),
            factory.createToken(SyntaxKind.ColonToken),
            factory.createCallExpression(factory.createIdentifier('formatter'), undefined, [
              factory.createPropertyAccessChain(
                factory.createIdentifier('item'),
                factory.createToken(SyntaxKind.QuestionDotToken),
                factory.createIdentifier(columnId),
              ),
              this.createFormatArg(columnId),
            ]),
          ),
        ),
      ],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.TableCell)),
    );
  }

  createTableBodyRow(): JsxElement {
    const tableBodyCells: JsxChild[] = this.viewDefinition.columns.map((column) =>
      this.createTableBodyCellFromColumn(column),
    );
    return this.createTableRow(tableBodyCells, this.createRowOnClickCBAttr());
  }

  createTableBodyElement(): JsxChild {
    const itemParam = factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier('item'),
      undefined,
      undefined,
      undefined,
    );
    const indexParam = factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier('index'),
      undefined,
      undefined,
      undefined,
    );
    return factory.createJsxElement(
      factory.createJsxOpeningElement(
        factory.createIdentifier(Primitive.TableBody),
        undefined,
        factory.createJsxAttributes([]),
      ),
      [
        factory.createJsxExpression(
          undefined,
          factory.createCallExpression(
            factory.createPropertyAccessExpression(factory.createIdentifier('items'), factory.createIdentifier('map')),
            undefined,
            [
              factory.createArrowFunction(
                undefined,
                undefined,
                [itemParam, indexParam],
                undefined,
                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                factory.createParenthesizedExpression(this.createTableBodyRow()),
              ),
            ],
          ),
        ),
      ],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.TableBody)),
    );
  }

  renderElement(): JsxElement {
    return factory.createJsxElement(
      this.createOpeningTableElement(),
      [this.createTableHeadElementBlock(), this.createTableBodyElement()],
      factory.createJsxClosingElement(factory.createIdentifier(Primitive.Table)),
    );
  }
}
