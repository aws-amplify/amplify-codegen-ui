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
import React from 'react';

import { Heading, View } from '@aws-amplify/ui-react';
import {
  AlertPrimitive,
  BadgePrimitive,
  ButtonPrimitive,
  ButtonGroupPrimitive,
  CardPrimitive,
  CheckboxFieldPrimitive,
  CollectionPrimitive,
  DividerPrimitive,
  FlexPrimitive,
  GridPrimitive,
  HeadingPrimitive,
  IconPrimitive,
  ImagePrimitive,
  LabelPrimitive,
  LinkPrimitive,
  LoaderPrimitive,
  PaginationPrimitive,
  PasswordFieldPrimitive,
  PhoneNumberFieldPrimitive,
  PlaceholderPrimitive,
  RadioPrimitive,
  RadioGroupFieldPrimitive,
  RatingPrimitive,
  ScrollViewPrimitive,
  SearchFieldPrimitive,
  SelectFieldPrimitive,
  SliderFieldPrimitive,
  StepperFieldPrimitive,
  SwitchFieldPrimitive,
  TabsPrimitive,
  TextPrimitive,
  TextFieldPrimitive,
  ToggleButtonPrimitive,
  ToggleButtonGroupPrimitive,
  ViewPrimitive,
  VisuallyHiddenPrimitive,
} from './ui-components'; // eslint-disable-line import/extensions

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
      <View id="divider">
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
      <View id="slider-field">
        <Heading>Slider Field</Heading>
        <SliderFieldPrimitive />
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
      <View id="text-field">
        <Heading>Text Field</Heading>
        <TextFieldPrimitive />
      </View>
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
