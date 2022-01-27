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
import { useState, SyntheticEvent } from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AmplifyProvider, View, Heading, Divider } from '@aws-amplify/ui-react';
import { Event } from './ui-components'; // eslint-disable-line import/extensions

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

  return (
    <AmplifyProvider>
      <Heading>Event</Heading>
      <View id="event">
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
    </AmplifyProvider>
  );
}
