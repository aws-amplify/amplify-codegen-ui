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
import { Buffer } from 'buffer';

const TEST_REGION = 'us-west-2';
const TEST_POOL_NAME = 'testpool';
const TEST_USER_NAME = 'testuser';
const MOCK_ENDPOINT = 'https://fake-appsync-endpoint/graphql';

export const DATA_STORE_MOCK_EXPORTS = {
  aws_appsync_graphqlEndpoint: MOCK_ENDPOINT,
};

export const AUTH_MOCK_EXPORTS = {
  aws_user_pools_id: `${TEST_REGION}_${TEST_POOL_NAME}`,
  aws_user_pools_web_client_id: TEST_POOL_NAME,
};

export const initializeAuthMockData = (authAttributes: Record<string, string>) => {
  const buildAuthKey = (key: string) => `CognitoIdentityServiceProvider.${TEST_POOL_NAME}.${TEST_USER_NAME}.${key}`;
  const generateJwt = (tokenData: any) => `.${Buffer.from(JSON.stringify(tokenData), 'utf8').toString('base64')}`;

  // Set expiry to 24h in the future
  const expiryTimestamp = Math.floor(Date.now() / 1000) + 86400;

  const userAttributes = Object.entries(authAttributes).map(([attrName, attrValue]) => {
    return { Name: attrName, Value: attrValue };
  });

  localStorage.setItem(`CognitoIdentityServiceProvider.${TEST_POOL_NAME}.LastAuthUser`, TEST_USER_NAME);
  localStorage.setItem(buildAuthKey('userData'), JSON.stringify({ UserAttributes: userAttributes }));
  localStorage.setItem(
    buildAuthKey('accessToken'),
    generateJwt({
      scope: 'aws.cognito.signin.user.admin',
      exp: expiryTimestamp,
    }),
  );
  localStorage.setItem(
    buildAuthKey('idToken'),
    generateJwt({
      exp: expiryTimestamp,
    }),
  );
};
