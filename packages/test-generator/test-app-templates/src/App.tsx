/* eslint-disable import/extensions */
import React from 'react';
import BoxWithButton from './ui-components/BoxWithButton';
import BoxWithCustomButton from './ui-components/BoxWithCustomButton';
import CollectionOfCustomButtons from './ui-components/CollectionOfCustomButtons';
import ComponentWithDataBinding from './ui-components/ComponentWithDataBinding';
import CustomButton from './ui-components/CustomButton';
import CustomText from './ui-components/CustomText';
import ListingCardCollection from './ui-components/ListingCardCollection';
import Profile from './ui-components/Profile';
import SectionHeading from './ui-components/SectionHeading';
import SiteHeader from './ui-components/SiteHeader';
import Test from './ui-components/Test';
import TextWithDataBinding from './ui-components/TextWithDataBinding';
/* eslint-enable import/extensions */

const App = () => {
  <>
    <BoxWithButton></BoxWithButton>
    <BoxWithCustomButton></BoxWithCustomButton>
    <CollectionOfCustomButtons></CollectionOfCustomButtons>
    <ComponentWithDataBinding></ComponentWithDataBinding>
    <CustomButton></CustomButton>
    <CustomText></CustomText>
    <ListingCardCollection></ListingCardCollection>
    <Profile></Profile>
    <SectionHeading></SectionHeading>
    <SiteHeader></SiteHeader>
    <Test></Test>
    <TextWithDataBinding></TextWithDataBinding>
  </>;
};

export default App;
