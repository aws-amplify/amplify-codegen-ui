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
import { useState, useEffect } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, Heading } from '@aws-amplify/ui-react';
import { DataStore } from '@aws-amplify/datastore';
import { Listing } from './models';
import { FullForm, Listings } from './ui-components'; // eslint-disable-line import/extensions

export default function AmIADevYet() {
  const [isInitialized, setInitialized] = useState(false);

  const initializeListingData = async (): Promise<void> => {
    await DataStore.save(
      new Listing({
        title: "Alpine Annie’s' - 30 Min. to White Pass Ski Area!",
        description:
          // eslint-disable-next-line max-len
          "Book your ski trip for White Pass and stay at ‘Alpine Annie’s,’ an authentic 1-bedroom, 1-bathroom vacation rental cabin just 30 minutes from the Ski Area. With enough space to sleep 4 guests, this cozy A-frame offers all of the essentials including rugged wilderness decor, a gas fireplace, easy access to the recreational field and a massive deck with forest views. Whether you're in town to summit Mt. Rainier or ski at White Pass Resort, this is the perfect Washington home-away-from-home!",
        imageSrc: 'https://media.vrbo.com/lodging/25000000/24280000/24271200/24271129/d4e8d54b.f10.jpg',
        priceUSD: 1800,
        destinationUrl: 'https://www.vrbo.com/4981260ha',
      }),
    );
    // await DataStore.save(
    //   new Listing({
    //     title: 'The Black Bear Cabin located mins from leavenworth wa. Sleeps 8',
    //     description:
    // eslint-disable-next-line max-len
    //       'Black Bear Cabin, permit #0443, is a 3 bedroom 1 bath with loft cabin, situated on a flat acre and a half of pine trees and native vegetation. When escaping the city is needed familys come here to our cabin. With comfy beds and good pillows, a well stocked kitchen for any cook and a spacious acre and a half of privacy and room for kids to play. The sledding hill is a 5 min walk from cabin for hours of fun. When your done playing for the day, return to the cabin for a hot tub to relax with a glass of wine with friends.',
    //     imageSrc: 'https://media.vrbo.com/lodging/33000000/32820000/32813000/32812914/f22fcef9.f10.jpg',
    //     priceUSD: 1800,
    //     destinationUrl: 'https://www.vrbo.com/646725',
    //   }),
    // );
  };

  useEffect(() => {
    const initializeTestState = async () => {
      // DataStore.clear() doesn't appear to reliably work in this scenario.
      indexedDB.deleteDatabase('amplify-datastore');
      await initializeListingData();
      setInitialized(true);
    };

    initializeTestState();
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <AmplifyProvider>
      <Heading level={1}>Listings</Heading>
      <Listings />
      <FullForm />
    </AmplifyProvider>
  );
}
