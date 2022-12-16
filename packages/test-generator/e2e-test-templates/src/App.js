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
import { Amplify, Auth, AuthModeStrategyType } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider } from '@aws-amplify/ui-react';
import { useEffect, useRef, useState } from 'react';
import awsconfig from './aws-exports';
import { ActionCardCollection, BlogPosts } from './ui-components';

Amplify.configure({
  ...awsconfig,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
});

function App() {
  const [user, setUser] = useState();

  const initiated = useRef(false);
  useEffect(() => {
    if (initiated.current) {
      return;
    }
    async function signIn() {
      let currentUser;
      try {
        currentUser = await Auth.signIn(process.env.USER_EMAIL, process.env.USER_PASSWORD);
        setUser(currentUser);
      } catch {
        console.log('error signing in');
      }
    }
    signIn();
    initiated.current = true;
  }, []);

  if (process.env.USER_EMAIL) {
    return <div>Email exists</div>;
  }

  if (user) {
    return (
      <AmplifyProvider>
        <BlogPosts id="blogPosts" />
        <ActionCardCollection id="actionCardCollection" />
      </AmplifyProvider>
    );
  }

  return null;
}

export default App;
