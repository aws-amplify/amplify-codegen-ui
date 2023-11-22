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
export const useAuthString = `export const useAuth = () => {
  const [result, setResult] = React.useState({
    error: undefined,
    isLoading: true,
    user: undefined,
  });

  const fetchCurrentUserAttributes = React.useCallback(async () => {
    setResult((prevResult) => ({ ...prevResult, isLoading: true }));

    try {
      const attributes = await fetchUserAttributes();
      setResult({ user: {attributes}, isLoading: false });
    } catch (error) {
      setResult({ error, isLoading: false });
    }
  }, []);

  const handleAuth = React.useCallback(
    ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
        case 'signUp':
        case 'tokenRefresh':
        case 'autoSignIn': {
          fetchCurrentUserAttributes();
          break;
        }
        case 'signedOut': {
          setResult({ user: undefined, isLoading: false });
          break;
        }

        case 'tokenRefresh_failure':
        case 'signIn_failure': {
          setResult({ error: payload.data, isLoading: false });
          break;
        }
        case 'autoSignIn_failure': {
          setResult({ error: new Error(payload.message), isLoading: false });
          break;
        }

        default: {
          break;
        }
      }
    },
    [fetchCurrentUserAttributes]
  );

  React.useEffect(() => {
    const unsubscribe = Hub.listen('auth', handleAuth, 'useAuth');
    fetchCurrentUserAttributes();

    return unsubscribe;
  }, [handleAuth, fetchCurrentUserAttributes]);

  return {
    ...result,
  };
};`;
