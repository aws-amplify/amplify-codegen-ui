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
import { Amplify } from 'aws-amplify';
import { useState, SyntheticEvent, useEffect, useRef } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { ThemeProvider, View, Heading, Divider, Button } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify/utils';
import { DataStore } from '@aws-amplify/datastore';
import { useDataStoreBinding } from './ui-components/utils'; // eslint-disable-line import/extensions
import { ComplexModel, User } from './models';
import {
  AuthSignOutActions,
  Event,
  NavigationActions,
  InternalMutation,
  MutationWithSyntheticProp,
  SetStateWithoutInitialValue,
  UpdateVisibility,
  DataStoreActions,
  FormWithState,
  SimpleUserCollection,
  InputMutationOnClick,
  ConditionalInMutation,
  CreateModelWithComplexTypes,
} from './ui-components'; // eslint-disable-line import/extensions
import { DATA_STORE_MOCK_EXPORTS, AUTH_MOCK_EXPORTS } from './mock-utils';

type AuthState = 'LoggedIn' | 'LoggedOutLocally' | 'LoggedOutGlobally' | 'Error';

// Call configure again to remove the tokenProvider for signOut tests to pass
Amplify.configure({
  Auth: {
    Cognito: {
      ...AUTH_MOCK_EXPORTS,
    },
  },
  API: {
    GraphQL: {
      ...DATA_STORE_MOCK_EXPORTS,
    },
  },
});

export default function ComplexTests() {
  const [clicked, click] = useState('');
  const [doubleclicked, doubleclick] = useState('');
  const [mouseddown, mousedown] = useState('');
  const [mouseentered, mouseenter] = useState('');
  const [mouseleft, mouseleave] = useState('');
  const [mousemoved, mousemove] = useState('');
  const [mousedout, mouseout] = useState('');
  const [mousedover, mouseover] = useState('');
  const [mousedup, mouseup] = useState('');
  const [changed, change] = useState('');
  const [inputted, input] = useState('');
  const [focused, focus] = useState('');
  const [blurred, blur] = useState('');
  const [keyeddown, keydown] = useState('');
  const [keypressed, keypress] = useState('');
  const [keyedup, keyup] = useState('');
  const [isInitialized, setInitialized] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [idToUpdate, setIdToUpdate] = useState('');
  const [hasDisappeared, setDisappeared] = useState(false);
  const [authState, setAuthState] = useState<AuthState>('LoggedIn');
  const [formIdToUpdate, setFormIdToUpdate] = useState('');
  const initializeStarted = useRef(false);

  const initializeUserTestData = async (): Promise<void> => {
    await DataStore.save(new User({ firstName: 'DeleteMe', lastName: 'Me' }));
    await DataStore.save(new User({ firstName: 'UpdateMe', lastName: 'Me' }));
    await DataStore.save(new User({ firstName: 'FormUpdate', lastName: 'Me' }));
  };

  const initializeAuthListener = () => {
    Hub.listen('ui', (message: any) => {
      const { event, data } = message && message.payload;
      if (event === 'actions:auth:signout:finished') {
        const {
          options: { global },
        } = data;
        if (global === true) {
          setAuthState('LoggedOutGlobally');
        } else if (global !== undefined && global !== null && global === false) {
          setAuthState('LoggedOutLocally');
        } else {
          setAuthState('Error');
        }
      }
    });
  };

  useEffect(() => {
    const initializeTestState = async () => {
      if (initializeStarted.current) {
        return;
      }
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore').onsuccess = async function () {
        await initializeUserTestData();
        const queriedIdToDelete = (await DataStore.query(User, (criteria) => criteria.firstName.eq('DeleteMe')))[0].id;
        setIdToDelete(queriedIdToDelete);
        const queriedIdToUpdate = (await DataStore.query(User, (criteria) => criteria.firstName.eq('UpdateMe')))[0].id;
        setIdToUpdate(queriedIdToUpdate);
        const queriedFormIdToUpdate = (
          await DataStore.query(User, (criteria) => criteria.firstName.eq('FormUpdate'))
        )[0].id;
        setFormIdToUpdate(queriedFormIdToUpdate);
        initializeAuthListener();
        setInitialized(true);
      };
    };

    initializeTestState();
    initializeStarted.current = true;
  }, []);

  const complexModels = useDataStoreBinding({
    type: 'collection',
    model: ComplexModel,
  }) as any;

  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <View id="event">
        <Heading>Events</Heading>
        <Event
          onClick={() => {
            click('✅');
          }}
          clicked={clicked}
          onDoubleClick={() => {
            doubleclick('✅');
          }}
          doubleclicked={doubleclicked}
          onMouseDown={() => {
            mousedown('✅');
          }}
          mouseddown={mouseddown}
          onMouseEnter={() => {
            mouseenter('✅');
          }}
          mouseentered={mouseentered}
          onMouseLeave={() => {
            mouseleave('✅');
          }}
          mouseleft={mouseleft}
          onMouseMove={() => {
            mousemove('✅');
          }}
          mousemoved={mousemoved}
          onMouseOut={() => {
            mouseout('✅');
          }}
          mousedout={mousedout}
          onMouseOver={() => {
            mouseover('✅');
          }}
          mousedover={mousedover}
          onMouseUp={() => {
            mouseup('✅');
          }}
          mousedup={mousedup}
          onChange={(event: SyntheticEvent) => {
            change((event.target as HTMLInputElement).value);
          }}
          changed={changed}
          onInput={(event: SyntheticEvent) => {
            input((event.target as HTMLInputElement).value);
          }}
          inputted={inputted}
          onFocus={() => {
            focus('✅');
          }}
          focused={focused}
          onBlur={() => {
            blur('✅');
          }}
          blurred={blurred}
          onKeyDown={() => {
            keydown('✅');
          }}
          keyeddown={keyeddown}
          onKeyPress={() => {
            keypress('✅');
          }}
          keypressed={keypressed}
          onKeyUp={() => {
            keyup('✅');
          }}
          keyedup={keyedup}
        />
      </View>
      <Divider />
      <View id="navigation">
        <Heading>Navigation Actions</Heading>
        <NavigationActions />
        {!hasDisappeared && (
          <Button
            id="i-disappear"
            onClick={() => {
              setDisappeared(true);
            }}
          >
            I Disappear
          </Button>
        )}
      </View>
      <Divider />
      <View id="auth">
        <Heading>Auth Actions</Heading>
        <AuthSignOutActions />
        <span id="auth-state">{authState}</span>
      </View>
      <Divider />
      <View id="datastore">
        <Heading>DataStore Actions</Heading>
        <DataStoreActions idToUpdate={idToUpdate} idToDelete={idToDelete} />
        <SimpleUserCollection id="user-collection" />
      </View>
      <Divider />
      <View id="state">
        <Heading>State Actions</Heading>
        <FormWithState idToUpdate={formIdToUpdate} />
      </View>
      <Divider />
      <View id="mutation">
        <Heading>Mutation Actions</Heading>
        <InternalMutation />
        <MutationWithSyntheticProp />
        <SetStateWithoutInitialValue />
        <UpdateVisibility />
        <InputMutationOnClick />
        <ConditionalInMutation user={new User({ age: 45 })} />
      </View>
      <Divider />
      <View id="complex-model">
        <CreateModelWithComplexTypes />
        {complexModels && complexModels.items && complexModels.items.length === 1 && (
          <code>{JSON.stringify(complexModels.items[0])}</code>
        )}
      </View>
    </ThemeProvider>
  );
}
