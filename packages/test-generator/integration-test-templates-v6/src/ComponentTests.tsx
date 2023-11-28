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
import { useEffect, useState, useRef } from 'react';
import { ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { DataStore } from '@aws-amplify/datastore';
import { User, Listing, Class, CompositeBowl, CompositeToy, CompositeOwner, CompositeDog } from './models';
import {
  ViewTest,
  ViewWithButton,
  CustomButton,
  BasicComponentBadge,
  BasicComponentView,
  BasicComponentButton,
  BasicComponentCard,
  BasicComponentCollection,
  BasicComponentText,
  ComponentWithConcatenation,
  ComponentWithConditional,
  BasicComponentDivider,
  BasicComponentFlex,
  BasicComponentImage,
  BasicComponentCustomRating,
  ComponentWithVariant,
  ComponentWithVariantAndOverrides,
  ComponentWithVariantsAndNotOverrideChildProp,
  SimplePropertyBindingDefaultValue,
  BoundDefaultValue,
  SimpleAndBoundDefaultValue,
  CollectionDefaultValue,
  MyTheme,
  ComponentWithSimplePropertyBinding,
  ComponentWithSlotBinding,
  ComponentWithDataBindingWithoutPredicate,
  ComponentWithDataBindingWithPredicate,
  ComponentWithMultipleDataBindingsWithPredicate,
  CollectionWithBinding,
  CollectionWithSort,
  ParsedFixedValues,
  CustomChildren,
  CustomParent,
  CustomParentAndChildren,
  CollectionWithBindingItemsName,
  ComponentWithBoundPropertyConditional,
  ComponentWithNestedOverrides,
  PaginatedCollection,
  SearchableCollection,
  ComponentWithAuthBinding,
  DataBindingNamedClass,
  CollectionWithCompositeKeysAndRelationships,
  CollectionWithBetweenPredicate,
} from './ui-components'; // eslint-disable-line import/extensions
import { initializeAuthMockData } from './mock-utils';

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

const initializeCompositeDogTestData = async (): Promise<void> => {
  const connectedBowl = await DataStore.save(new CompositeBowl({ shape: 'round', size: 'xl' }));
  const connectedOwner = await DataStore.save(new CompositeOwner({ lastName: 'Erica', firstName: 'Raunak' }));

  const connectedToys = await Promise.all([
    DataStore.save(new CompositeToy({ kind: 'stick', color: 'oak' })),
    DataStore.save(new CompositeToy({ kind: 'ball', color: 'green' })),
  ]);

  const createdRecord = await DataStore.save(
    new CompositeDog({
      name: 'Ruca',
      description: 'fetch maniac',
      CompositeBowl: connectedBowl,
      CompositeOwner: connectedOwner,
    }),
  );

  await Promise.all(
    connectedToys.map((toy) => {
      return DataStore.save(
        CompositeToy.copyOf(toy, (updated) => {
          Object.assign(updated, {
            compositeDogCompositeToysName: createdRecord.name,
            compositeDogCompositeToysDescription: createdRecord.description,
          });
        }),
      );
    }),
  );
};

export default function ComponentTests() {
  const [isInitialized, setInitialized] = useState(false);
  const initializeStarted = useRef(false);

  useEffect(() => {
    const initializeTestUserData = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await Promise.all([initializeUserTestData(), initializeListingTestData(), initializeCompositeDogTestData()]);
      initializeAuthMockData({
        picture: 'http://media.corporate-ir.net/media_files/IROL/17/176060/Oct18/AWS.png',
        username: 'TestUser',
        'custom:favorite_icecream': 'Mint Chip',
      });
      setInitialized(true);
    };

    initializeTestUserData();
    initializeStarted.current = true;
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeProvider theme={MyTheme}>
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
          buttonUser={
            new User({
              firstName: 'Norm',
              lastName: 'Gunderson',
              age: -1,
            })
          }
        />
        <ComponentWithConditional
          id="conditional1"
          buttonUser={
            new User({
              firstName: 'Disabled',
              lastName: 'Conditional Button',
              isLoggedIn: false,
              loggedInColor: 'blue',
              loggedOutColor: 'red',
              age: -1,
            })
          }
        />
        <ComponentWithConditional
          id="conditional2"
          buttonUser={
            new User({
              isLoggedIn: true,
              loggedInColor: 'blue',
              loggedOutColor: 'red',
            })
          }
        />
        <ComponentWithConditional
          id="conditional3"
          buttonUser={
            new User({
              isLoggedIn: true,
              loggedInColor: 'blue',
              loggedOutColor: 'red',
            })
          }
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
        <ComponentWithVariant id="variant4" variant="success" />
        <ComponentWithVariant id="variant5" variant="light" />
        <ComponentWithVariant id="variantWithRest" variant="secondary" fontSize="10px" />
        <ComponentWithVariantsAndNotOverrideChildProp id="variant6" mode="test" />
        <ComponentWithVariantAndOverrides id="variantAndOverrideDefault" />
        <ComponentWithVariantAndOverrides id="variantAndOverrideVariantValue" variant="greeting" />
        <ComponentWithVariantAndOverrides
          id="variantAndOverrideOverrideApplied"
          overrides={{ ComponentWithVariantAndOverrides: { children: 'Overriden Text' } }}
        />
        <ComponentWithVariantAndOverrides
          id="variantAndOverrideVariantValueAndNonOverlappingOverride"
          variant="farewell"
          overrides={{ ComponentWithVariantAndOverrides: { color: 'red' } }}
        />
        <ComponentWithVariantAndOverrides
          id="variantAndOverrideVariantValueAndOverlappingOverride"
          variant="farewell"
          overrides={{ ComponentWithVariantAndOverrides: { children: 'Overriden Text' } }}
        />
      </div>
      <div id="data-binding">
        <h2>Data Binding</h2>
        <ComponentWithSimplePropertyBinding id="simplePropIsDisabled" isDisabled />
        <ComponentWithSimplePropertyBinding id="simplePropIsNotDisabled" isDisabled={false} />
        <ComponentWithDataBindingWithoutPredicate id="dataStoreBindingWithoutPredicateNoOverride" />
        <ComponentWithDataBindingWithoutPredicate
          id="dataStoreBindingWithoutPredicateWithOverride"
          buttonUser={
            new User({
              firstName: 'Override Name',
              age: -1,
            })
          }
        />
        <ComponentWithDataBindingWithPredicate id="dataStoreBindingWithPredicateNoOverrideNoModel" />
        <ComponentWithDataBindingWithPredicate
          id="dataStoreBindingWithPredicateWithOverride"
          buttonUser={
            new User({
              firstName: 'Override Name',
            })
          }
        />
        <ComponentWithAuthBinding id="authBinding" />
        <ComponentWithMultipleDataBindingsWithPredicate
          id="multipleDataBindings"
          user={
            new User({
              firstName: 'QA',
            })
          }
          listing={
            new Listing({
              priceUSD: 2200,
            })
          }
        />
        <ComponentWithSlotBinding id="slotBinding" mySlot={<div>Customer component</div>} />
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
        <SearchableCollection id="searchableCollection" searchPlaceholder="Type to search" />
        <CollectionWithBinding
          id="collectionWithOverrideItems"
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
          overrideItems={({ item, index }) => {
            return {
              children: `${index} - ${item.lastName}, ${item.firstName}`,
            };
          }}
        />
        <CollectionWithBinding
          id="collectionWithJSXOverrideItems"
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
          overrideItems={({ item }) => {
            return {
              children: (
                <>
                  <div>{item.lastName}</div>
                  <div>{item.firstName}</div>
                </>
              ),
            };
          }}
        />
        <CollectionWithCompositeKeysAndRelationships
          id="collectionWithCompositeKeysAndRelationships"
          overrideItems={({ item }) => {
            return {
              mySlot: (
                <div>
                  <span>{`Owner: ${item.CompositeOwner?.lastName}`}</span>
                  <span>{`Bowl: ${item.CompositeBowl?.shape}`}</span>
                  <span>{`Toys: ${item.CompositeToys?.map((toy: CompositeToy) => toy.kind).join(', ')}`}</span>
                </div>
              ),
            };
          }}
        />
        <CollectionWithBetweenPredicate id="collectionWithBetweenPredicate" />
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
            ComponentWithNestedOverrides: { backgroundColor: 'red' },
            ChildFlex3: { backgroundColor: 'green' },
            ChildChildFlex1: { backgroundColor: 'blue' },
          }}
        />
      </div>
      <div id="reserved-keywords">
        <DataBindingNamedClass class={new Class({ name: 'biology' })} />
      </div>
    </ThemeProvider>
  );
}
