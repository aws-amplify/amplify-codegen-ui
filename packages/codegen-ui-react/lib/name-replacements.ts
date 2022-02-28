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

// List of character and description source https://www.ascii-code.com/
const nameReplacements: [RegExp, string][] = [
  [/ /g, ''], // remove spaces
  [/!/g, 'ExclamationMark'],
  [/"/g, 'DoubleQuotes'],
  [/#/g, 'Nmber'],
  [/\$/g, 'Dollar'],
  [/&/g, 'Ampersand'],
  [/'/g, 'SingleQuote'],
  [/\(/g, 'OpenParenthesis'],
  [/\)/g, 'CloseParenthesis'],
  [/\*/g, 'Asterisk'],
  [/\+/g, 'Plus'],
  [/,/g, 'Comma'],
  [/-/g, ''], // remove hypens
  [/\./g, 'Period'],
  [/\//g, 'Slash'],
  [/0/g, 'Zero'],
  [/1/g, 'One'],
  [/2/g, 'Two'],
  [/3/g, 'Three'],
  [/4/g, 'Four'],
  [/5/g, 'Five'],
  [/6/g, 'Six'],
  [/7/g, 'Seven'],
  [/8/g, 'Eight'],
  [/9/g, 'Nine'],
  [/:/g, 'Colon'],
  [/;/g, 'Semicolon'],
  [/</g, 'LessThan'],
  [/=/g, 'Equal'],
  [/>/g, 'GreaterThan'],
  [/\?/g, 'QuestionMark'],
  [/@/g, 'AtSymbol'],
  [/\[/g, 'OpeningBracket'],
  [/\]/g, 'ClosingBracket'],
  [/\^/g, 'Caret'],
  [/_/g, 'UnderScore'], // remove underscores
  [/`/g, 'GraveAccent'],
  [/~/g, 'Tilde'],
];

export default nameReplacements;
