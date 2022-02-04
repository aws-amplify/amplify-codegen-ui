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
import { useState, SyntheticEvent, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, View, Heading, Divider, Button } from '@aws-amplify/ui-react';
import { Hub } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { User } from './models';
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
} from './ui-components'; // eslint-disable-line import/extensions

type AuthState = 'LoggedIn' | 'LoggedOutLocally' | 'LoggedOutGlobally' | 'Error';

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

  const initializeUserTestData = async (): Promise<void> => {
    await DataStore.save(new User({ firstName: 'DeleteMe', lastName: 'Me' }));
    await DataStore.save(new User({ firstName: 'UpdateMe', lastName: 'Me' }));
  };

  const initializeAuthListener = () => {
    Hub.listen('ui-actions', (message: any) => {
      const { event, data } = message && message.payload;
      if (event === 'AuthSignOut_Finished') {
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
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeUserTestData();
      const queriedIdToDelete = (await DataStore.query(User, (criteria) => criteria.firstName('eq', 'DeleteMe')))[0].id;
      setIdToDelete(queriedIdToDelete);
      const queriedIdToUpdate = (await DataStore.query(User, (criteria) => criteria.firstName('eq', 'UpdateMe')))[0].id;
      setIdToUpdate(queriedIdToUpdate);
      initializeAuthListener();
      setInitialized(true);
    };

    initializeTestState();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <AmplifyProvider>
      <View id="event">
        <Heading>Events</Heading>
        <Event
          click={() => {
            click('✅');
          }}
          clicked={clicked}
          doubleclick={() => {
            doubleclick('✅');
          }}
          doubleclicked={doubleclicked}
          mousedown={() => {
            mousedown('✅');
          }}
          mouseddown={mouseddown}
          mouseenter={() => {
            mouseenter('✅');
          }}
          mouseentered={mouseentered}
          mouseleave={() => {
            mouseleave('✅');
          }}
          mouseleft={mouseleft}
          mousemove={() => {
            mousemove('✅');
          }}
          mousemoved={mousemoved}
          mouseout={() => {
            mouseout('✅');
          }}
          mousedout={mousedout}
          mouseover={() => {
            mouseover('✅');
          }}
          mousedover={mousedover}
          mouseup={() => {
            mouseup('✅');
          }}
          mousedup={mousedup}
          change={(event: SyntheticEvent) => {
            change((event.target as HTMLInputElement).value);
          }}
          changed={changed}
          input={(event: SyntheticEvent) => {
            input((event.target as HTMLInputElement).value);
          }}
          inputted={inputted}
          focus={() => {
            focus('✅');
          }}
          focused={focused}
          blur={() => {
            blur('✅');
          }}
          blurred={blurred}
          keydown={() => {
            keydown('✅');
          }}
          keyeddown={keyeddown}
          keypress={() => {
            keypress('✅');
          }}
          keypressed={keypressed}
          keyup={() => {
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
        <FormWithState />
      </View>
      <Divider />
      <View id="mutation">
        <Heading>Mutation Actions</Heading>
        <InternalMutation />
        <MutationWithSyntheticProp />
        <SetStateWithoutInitialValue />
        <UpdateVisibility />
      </View>
    </AmplifyProvider>
  );
}
