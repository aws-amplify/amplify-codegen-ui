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
import { useEffect, useState } from 'react';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ViewTest from './ui-components/ViewTest';
import ViewWithButton from './ui-components/ViewWithButton';
import CustomButton from './ui-components/CustomButton';
import BasicComponentBadge from './ui-components/BasicComponentBadge';
import BasicComponentView from './ui-components/BasicComponentView';
import BasicComponentButton from './ui-components/BasicComponentButton';
import BasicComponentCard from './ui-components/BasicComponentCard';
import BasicComponentCollection from './ui-components/BasicComponentCollection';
import BasicComponentText from './ui-components/BasicComponentText';
import ComponentWithConcatenation from './ui-components/ComponentWithConcatenation';
import ComponentWithConditional from './ui-components/ComponentWithConditional';
import BasicComponentDivider from './ui-components/BasicComponentDivider';
import BasicComponentFlex from './ui-components/BasicComponentFlex';
import BasicComponentImage from './ui-components/BasicComponentImage';
import BasicComponentCustomRating from './ui-components/BasicComponentCustomRating';
import ComponentWithVariant from './ui-components/ComponentWithVariant';
import SimplePropertyBindingDefaultValue from './ui-components/SimplePropertyBindingDefaultValue';
import BoundDefaultValue from './ui-components/BoundDefaultValue';
import SimpleAndBoundDefaultValue from './ui-components/SimpleAndBoundDefaultValue';
import CollectionDefaultValue from './ui-components/CollectionDefaultValue';
import theme from './ui-components/MyTheme';
import ComponentWithSimplePropertyBinding from './ui-components/ComponentWithSimplePropertyBinding';
import ComponentWithDataBindingWithoutPredicate from './ui-components/ComponentWithDataBindingWithoutPredicate';
import ComponentWithDataBindingWithPredicate from './ui-components/ComponentWithDataBindingWithPredicate';
import CollectionWithBinding from './ui-components/CollectionWithBinding';
import CollectionWithSort from './ui-components/CollectionWithSort';
import ParsedFixedValues from './ui-components/ParsedFixedValues';
import CustomChildren from './ui-components/CustomChildren';
import CustomParent from './ui-components/CustomParent';
import CustomParentAndChildren from './ui-components/CustomParentAndChildren';
import { DataStore } from 'aws-amplify';
import { User, Listing } from './models';
import CollectionWithBindingItemsName from './ui-components/CollectionWithBindingItemsName';
import ComponentWithBoundPropertyConditional from './ui-components/ComponentWithBoundPropertyConditional';
import ComponentWithNestedOverrides from './ui-components/ComponentWithNestedOverrides';
import PaginatedCollection from './ui-components/PaginatedCollection';
import ComponentWithAuthBinding from './ui-components/ComponentWithAuthBinding';
/* eslint-enable import/extensions */

const initializeUserTestData = async (): Promise<void> => {
  await DataStore.save(new User({ firstName: 'Real', lastName: 'LUser3', age: 29 }));
  await DataStore.save(new User({ firstName: 'Another', lastName: 'LUser2', age: 72 }));
  await DataStore.save(new User({ firstName: 'Last', lastName: 'LUser1', age: 50 }));
  await DataStore.save(new User({ firstName: 'Too Young', lastName: 'LUser0', age: 5 }));
};

const initializeListingTestData = async (): Promise<void> => {
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

export default function ComponentTests() {
  const [isInitialized, setInitialized] = useState(false);
  useEffect(() => {
    const initializeTestUserData = async () => {
      indexedDB.deleteDatabase('amplify-datastore'); // DataStore.clear() doesn't appear to reliably work in this scenario.
      await Promise.all([initializeUserTestData(), initializeListingTestData()]);
      setInitialized(true);
    };

    initializeTestUserData();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    /* components prop is required. https://github.com/aws-amplify/amplify-ui/issues/575 */
    <AmplifyProvider theme={theme} components={{}}>
      <h1>Generated Component Tests</h1>
      <div id={'basic-components'}>
        <h2>Basic Components</h2>
        <BasicComponentBadge />
        <BasicComponentView />
        <BasicComponentButton />
        <BasicComponentCard />
        <BasicComponentCollection items={[0, 1]} />
        <BasicComponentDivider />
        <BasicComponentFlex />
        <BasicComponentText />
        <BasicComponentImage />
        <BasicComponentCustomRating />
      </div>
      <ViewTest />
      <ViewWithButton />
      <CustomButton />
      <div id="concat-and-conditional">
        <h2>Concatenation and Conditional Tests</h2>
        <ComponentWithConcatenation />
        <ComponentWithConcatenation
          buttonUser={{
            id: '1',
            firstName: 'Norm',
            lastName: 'Gunderson',
            age: -1,
          }}
        />
        <ComponentWithConditional
          id="conditional1"
          buttonUser={{
            id: '1',
            firstName: 'Disabled',
            lastName: 'Conditional Button',
            isLoggedIn: false,
            loggedInColor: 'blue',
            loggedOutColor: 'red',
            age: -1,
          }}
        />
        <ComponentWithConditional
          id="conditional2"
          buttonUser={{
            id: '1',
            isLoggedIn: true,
            loggedInColor: 'blue',
            loggedOutColor: 'red',
          }}
        />
        <ComponentWithConditional
          id="conditional3"
          buttonUser={{
            id: '1',
            isLoggedIn: true,
            loggedInColor: 'blue',
            loggedOutColor: 'red',
          }}
        />
        <ComponentWithBoundPropertyConditional id="ComponentWithBoundPropertyConditional-no-prop" />
        <ComponentWithBoundPropertyConditional id="ComponentWithBoundPropertyConditional-true-prop" buttonColor="red" />
        <ComponentWithBoundPropertyConditional
          id="ComponentWithBoundPropertyConditional-false-prop"
          buttonColor="green"
        />
      </div>
      <div id="variants">
        <h2>Variants</h2>
        <ComponentWithVariant id="variant1" variant="primary" />
        <ComponentWithVariant id="variant2" variant="secondary" />
        <ComponentWithVariant id="variant3" variant="primary" size="large" />
      </div>
      <div id="data-binding">
        <h2>Data Binding</h2>
        <ComponentWithSimplePropertyBinding id="simplePropIsDisabled" isDisabled />
        <ComponentWithSimplePropertyBinding id="simplePropIsNotDisabled" isDisabled={false} />
        <ComponentWithDataBindingWithoutPredicate id="dataStoreBindingWithoutPredicateNoOverride" />
        <ComponentWithDataBindingWithoutPredicate
          id="dataStoreBindingWithoutPredicateWithOverride"
          buttonUser={{
            id: '1',
            firstName: 'Override Name',
            age: -1,
          }}
        />
        <ComponentWithDataBindingWithPredicate id="dataStoreBindingWithPredicateNoOverrideNoModel" />
        <ComponentWithDataBindingWithPredicate
          id="dataStoreBindingWithPredicateWithOverride"
          buttonUser={{
            id: '1',
            firstName: 'Override Name',
          }}
        />
        <ComponentWithAuthBinding id="authBinding" />
      </div>
      <div id="collections">
        <h2>Collections</h2>
        <CollectionWithBinding
          id="collectionWithBindingAndOverrides"
          items={[
            {
              id: '1',
              firstName: 'Yankee',
              lastName: 'Doodle',
            },
            {
              id: '2',
              firstName: 'Feather',
              lastName: 'Cap',
            },
          ]}
        />
        <CollectionWithBinding id="collectionWithBindingNoOverrides" />
        <CollectionWithSort id="collectionWithSort" />
        <CollectionWithBindingItemsName id="collectionWithBindingItemsNameNoOverrides" />
        <CollectionWithBindingItemsName
          id="collectionWithBindingItemsNameWithOverrides"
          items={[
            {
              id: '1',
              firstName: 'Yankee',
              lastName: 'Doodle',
            },
            {
              id: '2',
              firstName: 'Feather',
              lastName: 'Cap',
            },
          ]}
        />
        <PaginatedCollection id="paginatedCollection" />
      </div>
      <div id="default-value">
        <h2>Default Value</h2>
        <SimplePropertyBindingDefaultValue id="bound-simple-binding-default" />
        <SimplePropertyBindingDefaultValue id="bound-simple-binding-override" label="Override Simple Binding" />
        <BoundDefaultValue id="bound-default" />
        <BoundDefaultValue id="bound-override" label="Override Bound" />
        <SimpleAndBoundDefaultValue id="simple-and-bound-default" />
        <SimpleAndBoundDefaultValue id="simple-and-bound-override" label="Override Simple And Bound" />
        <CollectionDefaultValue id="collection-default" items={[{}]} />
        <CollectionDefaultValue id="collection-override" items={[{ username: 'Override Collection' }]} />
      </div>
      <div id="parsed-fixed-values">
        <ParsedFixedValues />
      </div>
      <div id="custom-component">
        <CustomChildren />
        <CustomParent />
        <CustomParentAndChildren />
      </div>
      <div id="overrides">
        <h2>Overrides</h2>
        <ComponentWithNestedOverrides
          id="componentWithNestedOverrides"
          overrides={{
            Flex: { backgroundColor: 'red' },
            'Flex.Flex[2]': { backgroundColor: 'green' },
            'Flex.Flex[1].Flex[0]': { backgroundColor: 'blue' },
          }}
        />
      </div>
    </AmplifyProvider>
  );
}
