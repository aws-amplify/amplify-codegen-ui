/* eslint-disable import/extensions */
import React from 'react';
import BoxTest from './ui-components/BoxTest';
import BoxWithButton from './ui-components/BoxWithButton';
import BoxWithButtonExposedAs from './ui-components/BoxWithButtonExposedAs';
import CustomButton from './ui-components/CustomButton';
import CustomText from './ui-components/CustomText';
import TextWithDataBinding from './ui-components/TextWithDataBinding';
/* eslint-enable import/extensions */

function App() {
  return (
    <>
      <BoxTest></BoxTest>
      <BoxWithButton></BoxWithButton>
      <BoxWithButtonExposedAs></BoxWithButtonExposedAs>
      <CustomButton></CustomButton>
      <CustomText></CustomText>
      <TextWithDataBinding></TextWithDataBinding>
    </>
  );
}

export default App;
