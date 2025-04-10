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
export const COMPOSITE_PRIMARY_KEY_PROP_NAME = 'id';

export const STORAGE_FILE_KEY = 'key';

export const STORAGE_FILE_ALGO_TYPE = 'SHA-1';

export const AMPLIFY_JS_V5 = '5.0.0';

export const AMPLIFY_JS_V6 = '6.0.0';

export const scriptingPatterns = [
  // JavaScript functions
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /new\s+Function/i,
  /import\s*\(/i,
  /require\s*\(/i,

  // DOM manipulation
  /document\./i,
  /window\./i,
  /location\./i,

  // Event handlers
  /on\w+\s*=/i, // matches onerror=, onload=, etc.

  // Dangerous protocols
  /javascript:/i,
  /data:/i,
  /vbscript:/i,

  // Script tags and variations
  /<script/i,
  /<\/script/i,
  /<x:script/i,

  // SVG exploits
  /<svg/i,
  /xlink:href/i,

  // Object prototype attacks
  /\[\s*Symbol\s*\./i,
  /__proto__/i,
  /prototype\s*\./i,

  // Template literal attacks
  /\$\{/i,

  // Base64 indicators
  /base64/i,
];
