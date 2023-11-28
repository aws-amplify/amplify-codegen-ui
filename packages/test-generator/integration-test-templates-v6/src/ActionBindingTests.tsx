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
import React, { useState, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import { useDataStoreBinding } from './ui-components/utils'; // eslint-disable-line import/extensions
import { User, Listing } from './models';
// eslint-disable-next-line import/extensions
import { MutationActionBindings, DataStoreActionBindings, InitialValueBindings } from './ui-components';
import { initializeAuthMockData } from './mock-utils';

export default function ActionBindingTests() {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeTestState = async () => {
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await DataStore.save(new Listing({ title: 'Default Value' }));
      await DataStore.save(new User({ firstName: 'Johnny', lastName: 'Bound Value', age: 45 }));
      initializeAuthMockData({ email: 'Auth Value' });
      setInitialized(true);
    };

    initializeTestState();
  }, []);

  // Pulling this binding out here, since currently there's a bug in observeQuery, that doesn't let
  // us define a component which gets observable updates if a criteria is defined
  // https://github.com/aws-amplify/amplify-js/issues/9573
  const listing = (
    useDataStoreBinding({
      type: 'collection',
      model: Listing,
    }) as any
  ).items[0];

  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <MutationActionBindings
        overrides={{
          MutatedValue: { id: 'mutated-value' },
        }}
      />
      <DataStoreActionBindings
        listing={listing}
        overrides={{
          DataStoreValue: { id: 'data-store-value' },
        }}
      />
      <InitialValueBindings
        overrides={{
          FixedValueInitialBindingSection: { id: 'fixed-value-initial-binding-section' },
          BoundValueInitialBindingSection: { id: 'bound-value-initial-binding-section' },
          ConcatValueInitialBindingSection: { id: 'concat-value-initial-binding-section' },
          ConditionalValueInitialBindingSection: { id: 'conditional-value-initial-binding-section' },
          AuthValueInitialBindingSection: { id: 'auth-value-initial-binding-section' },
          StateValueInitialBindingSection: { id: 'state-value-initial-binding-section' },
          TextFieldValueInitialBindingSection: { id: 'text-field-value-initial-binding-section' },
        }}
      />
    </ThemeProvider>
  );
}
