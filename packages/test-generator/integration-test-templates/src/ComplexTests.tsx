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
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, View, Heading, Divider } from '@aws-amplify/ui-react';
import {
  ComplexTest1,
  ComplexTest2,
  ComplexTest3,
  ComplexTest4,
  ComplexTest5,
  ComplexTest6,
  ComplexTest7,
  ComplexTest8,
} from './ui-components';

export default function ComplexTests() {
  return (
    <AmplifyProvider>
      <Heading>Complex Test 1</Heading>
      <View id="complex-test-1">
        <ComplexTest1 />
      </View>
      <Divider />
      <Heading>Complex Test 2</Heading>
      <View id="complex-test-2">
        <ComplexTest2 />
      </View>
      <Divider />
      <Heading>Complex Test 3</Heading>
      <View id="complex-test-3">
        <ComplexTest3 />
      </View>
      <Divider />
      <Heading>Complex Test 4</Heading>
      <View id="complex-test-4">
        <ComplexTest4 />
      </View>
      <Divider />
      <Heading>Complex Test 5</Heading>
      <View id="complex-test-5">
        <ComplexTest5 />
      </View>
      <Divider />
      <Heading>Complex Test 6</Heading>
      <View id="complex-test-6">
        <ComplexTest6 />
      </View>
      <Heading>Complex Test 7</Heading>
      <View id="complex-test-7">
        <ComplexTest7 />
      </View>
      <Heading>Complex Test 8</Heading>
      <View id="complex-test-8">
        <ComplexTest8 />
      </View>
    </AmplifyProvider>
  );
}
