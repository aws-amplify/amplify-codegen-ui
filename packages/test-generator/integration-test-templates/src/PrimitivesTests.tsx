import React from 'react';

import { Heading, View } from '@aws-amplify/ui-react';
import AlertPrimitive from './ui-components/AlertPrimitive';
import BadgePrimitive from './ui-components/BadgePrimitive';
import ButtonPrimitive from './ui-components/ButtonPrimitive';
import ButtonGroupPrimitive from './ui-components/ButtonGroupPrimitive';
import CardPrimitive from './ui-components/CardPrimitive';
import CheckboxFieldPrimitive from './ui-components/CheckboxFieldPrimitive';
import CollectionPrimitive from './ui-components/CollectionPrimitive';
import DividerPrimitive from './ui-components/DividerPrimitive';
import FlexPrimitive from './ui-components/FlexPrimitive';
import GridPrimitive from './ui-components/GridPrimitive';
import HeadingPrimitive from './ui-components/HeadingPrimitive';
import IconPrimitive from './ui-components/IconPrimitive';
import ImagePrimitive from './ui-components/ImagePrimitive';
import LabelPrimitive from './ui-components/LabelPrimitive';
import LinkPrimitive from './ui-components/LinkPrimitive';
import LoaderPrimitive from './ui-components/LoaderPrimitive';
import PaginationPrimitive from './ui-components/PaginationPrimitive';
import PasswordFieldPrimitive from './ui-components/PasswordFieldPrimitive';
import PhoneNumberFieldPrimitive from './ui-components/PhoneNumberFieldPrimitive';
import PlaceholderPrimitive from './ui-components/PlaceholderPrimitive';
import RadioPrimitive from './ui-components/RadioPrimitive';
import RadioGroupFieldPrimitive from './ui-components/RadioGroupFieldPrimitive';
import RatingPrimitive from './ui-components/RatingPrimitive';
import ScrollViewPrimitive from './ui-components/ScrollViewPrimitive';
import SearchFieldPrimitive from './ui-components/SearchFieldPrimitive';
import SelectFieldPrimitive from './ui-components/SelectFieldPrimitive';
import StepperFieldPrimitive from './ui-components/StepperFieldPrimitive';
import SwitchFieldPrimitive from './ui-components/SwitchFieldPrimitive';
import TabsPrimitive from './ui-components/TabsPrimitive';
import TextPrimitive from './ui-components/TextPrimitive';
// import TextFieldPrimitive from './ui-components/TextFieldPrimitive';
import ToggleButtonPrimitive from './ui-components/ToggleButtonPrimitive';
import ToggleButtonGroupPrimitive from './ui-components/ToggleButtonGroupPrimitive';
import ViewPrimitive from './ui-components/ViewPrimitive';
import VisuallyHiddenPrimitive from './ui-components/VisuallyHiddenPrimitive';

export default function PrimitivesTests() {
  return (
    <>
      <View id="alert">
        <Heading>Alert</Heading>
        <AlertPrimitive />
      </View>
      <View id="badge">
        <Heading>Badge</Heading>
        <BadgePrimitive />
      </View>
      <View id="button">
        <Heading>Button</Heading>
        <ButtonPrimitive />
      </View>
      <View id="button-group">
        <Heading>Button Group</Heading>
        <ButtonGroupPrimitive />
      </View>
      <View id="card">
        <Heading>Card</Heading>
        <CardPrimitive />
      </View>
      <View id="checkbox-field">
        <Heading>Checkbox Field</Heading>
        <CheckboxFieldPrimitive />
      </View>
      <View id="collection">
        <Heading>Collection</Heading>
        <CollectionPrimitive />
      </View>
      <View id="Divider">
        <Heading>Divider</Heading>
        <DividerPrimitive />
      </View>
      <View id="flex">
        <Heading>Flex</Heading>
        <FlexPrimitive />
      </View>
      <View id="grid">
        <Heading>Grid</Heading>
        <GridPrimitive />
      </View>
      <View id="heading">
        <Heading>Heading</Heading>
        <HeadingPrimitive />
      </View>
      <View id="icon">
        <Heading>Icon</Heading>
        <IconPrimitive />
      </View>
      <View id="image">
        <Heading>Image</Heading>
        <ImagePrimitive />
      </View>
      <View id="label">
        <Heading>Label</Heading>
        <LabelPrimitive />
      </View>
      <View id="link">
        <Heading>Link</Heading>
        <LinkPrimitive />
      </View>
      <View id="loader">
        <Heading>Loader</Heading>
        <LoaderPrimitive />
      </View>
      <View id="pagination">
        <Heading>Pagination</Heading>
        <PaginationPrimitive />
      </View>
      <View id="password-field">
        <Heading>Password Field</Heading>
        <PasswordFieldPrimitive />
      </View>
      <View id="phone-number-field">
        <Heading>Phone Number Field</Heading>
        <PhoneNumberFieldPrimitive />
      </View>
      <View id="placeholder">
        <Heading>Placeholder</Heading>
        <PlaceholderPrimitive />
      </View>
      <View id="radio">
        <Heading>Radio</Heading>
        <RadioPrimitive />
      </View>
      <View id="radio-group-field">
        <Heading>Radio Group Field</Heading>
        <RadioGroupFieldPrimitive />
      </View>
      <View id="rating">
        <Heading>Rating</Heading>
        <RatingPrimitive />
      </View>
      <View id="scroll-view">
        <Heading>Scroll View</Heading>
        <ScrollViewPrimitive />
      </View>
      <View id="search-field">
        <Heading>Search Field</Heading>
        <SearchFieldPrimitive />
      </View>
      <View id="select-field">
        <Heading>Select Field</Heading>
        <SelectFieldPrimitive />
      </View>
      <View id="stepper-field">
        <Heading>Stepper Field</Heading>
        <StepperFieldPrimitive />
      </View>
      <View id="switch-field">
        <Heading>Switch Field</Heading>
        <SwitchFieldPrimitive />
      </View>
      <View id="tabs">
        <Heading>Tabs</Heading>
        <TabsPrimitive />
      </View>
      <View id="text">
        <Heading>Text</Heading>
        <TextPrimitive />
      </View>
      {/* <TextFieldPrimitive /> */}
      <View id="toggle-button">
        <Heading>Toggle Button</Heading>
        <ToggleButtonPrimitive />
      </View>
      <View id="toggle-button-group">
        <Heading>Toggle Button Group</Heading>
        <ToggleButtonGroupPrimitive />
      </View>
      <View id="view">
        <Heading>View</Heading>
        <ViewPrimitive />
      </View>
      <View id="visually-hidden">
        <Heading>Visually Hidden</Heading>
        <VisuallyHiddenPrimitive />
      </View>
    </>
  );
}
