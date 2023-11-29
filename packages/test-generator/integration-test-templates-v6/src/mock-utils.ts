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
import { DataStore } from '@aws-amplify/datastore';
import { Listing } from './models';

const TEST_REGION = 'us-west-2';
const TEST_POOL_NAME = 'testpool';
const TEST_USER_NAME = 'testuser';
const MOCK_ENDPOINT = 'https://fake-appsync-endpoint/graphql';

export const DATA_STORE_MOCK_EXPORTS = {
  endpoint: MOCK_ENDPOINT,
  defaultAuthMode: 'none' as const,
};

export const AUTH_MOCK_EXPORTS = {
  userPoolId: `${TEST_REGION}_${TEST_POOL_NAME}`,
  userPoolClientId: TEST_POOL_NAME,
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
export const initializeListingTestData = async (): Promise<void> => {
  await DataStore.save(
    new Listing({ title: 'Cozy Bungalow', priceUSD: 1500, description: 'Lorem ipsum dolor sit amet' }),
  );
  await DataStore.save(
    new Listing({
      title: 'Mountain Retreat',
      priceUSD: 1800,
      description: 'consectetur adipiscing elit, sed do eiusmod tempor incididunt',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Quiet Cottage',
      priceUSD: 1100,
      description: 'ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Creekside Hideaway',
      priceUSD: 950,
      description: 'quis nostrud exercitation ullamco laboris nisi ut aliquip',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Cabin in the Woods',
      priceUSD: 600,
      description: 'ex ea commodo consequat. Duis aute irure dolor in reprehenderit',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Cabin at the Lake (unit 1)',
      priceUSD: 700,
      description: 'in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Cabin at the Lake (unit 2)',
      priceUSD: 800,
      description: 'Excepteur sint occaecat cupidatat non proident',
    }),
  );
  await DataStore.save(
    new Listing({
      title: 'Beachside Cottage',
      priceUSD: 1000,
      description: 'sunt in culpa qui officia deserunt mollit anim id est laborum',
    }),
  );
  await DataStore.save(new Listing({ title: 'Lush Resort', priceUSD: 3500, description: 'Its real nice' }));
  await DataStore.save(new Listing({ title: 'Chalet away from home', priceUSD: 5000, description: 'youll like it' }));
};
