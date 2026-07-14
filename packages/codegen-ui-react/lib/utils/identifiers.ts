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

/**
 * Matches a simple JS identifier -- no dot-paths, no computed access.
 *
 * SECURITY: values that fail this test must not be passed to
 * factory.createIdentifier(), which emits its argument verbatim as source and
 * would otherwise allow code injection into generated output
 * (CVE-2025-4318 class).
 */
export const SIMPLE_JS_IDENTIFIER_RE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
