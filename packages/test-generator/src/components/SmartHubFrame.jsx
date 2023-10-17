/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { css } from "@emotion/css";
import Row from "@amzn/meridian/row";
import SideMenu, {
  SideMenuLink,
  SideMenuTitle,
} from "@amzn/meridian/side-menu";
import Column from "@amzn/meridian/column";
import Breadcrumb, { BreadcrumbGroup } from "@amzn/meridian/breadcrumb";
import Text from "@amzn/meridian/text";
import Button from "@amzn/meridian/button";
export default function SmartHubFrame(props) {
  return (
    <Row
      alignmentHorizontal="start"
      alignmentVertical="top"
      backgroundColor="rgba(255,255,255,1)"
      height="unset"
      spacingInset="none none none none"
      spacing="300"
      width="unset"
    >
      <SideMenu>
        <SideMenuTitle children="SmartHub"></SideMenuTitle>
        <SideMenuLink children="Orders"></SideMenuLink>
        <SideMenuLink children="Returns"></SideMenuLink>
        <SideMenuLink children="Products"></SideMenuLink>
        <SideMenuLink children="Inventory"></SideMenuLink>
      </SideMenu>
      <Column
        alignmentHorizontal="start"
        alignmentVertical="top"
        height="840px"
        spacingInset="600 300 600 300"
        spacing="300"
        width="1067px"
      >
        <Row
          alignmentHorizontal="start"
          alignmentVertical="bottom"
          backgroundColor="rgba(249,250,250,1)"
          height="unset"
          spacingInset="500 500 500 500"
          spacing="300"
          width="1047px"
          className={css({ border: "1px SOLID rgba(231,233,233,1)" })}
        >
          <Column
            alignmentHorizontal="start"
            alignmentVertical="top"
            height="unset"
            spacingInset="none none none none"
            spacing="400"
            width="100%"
          >
            <BreadcrumbGroup>
              <Breadcrumb children="All Returns"></Breadcrumb>
              <Breadcrumb children="POD Report"></Breadcrumb>
            </BreadcrumbGroup>
            <Column
              alignmentHorizontal="start"
              alignmentVertical="top"
              height="unset"
              spacingInset="none none none none"
              spacing="300"
              width="unset"
            >
              <Text
                alignment="left"
                fontFamily="amazonEmber"
                children="POD Report"
                type="d100"
              ></Text>
            </Column>
          </Column>
          <Row
            alignmentHorizontal="start"
            alignmentVertical="top"
            height="unset"
            spacingInset="none none none none"
            spacing="300"
            width="unset"
          >
            <Button
              size="large"
              type="link"
              children="View All Reports"
            ></Button>
            <Button
              size="medium"
              type="primary"
              children="Print Report"
            ></Button>
          </Row>
        </Row>
        <Column
          alignmentHorizontal="start"
          alignmentVertical="top"
          height="unset"
          spacingInset="none none none none"
          spacing="none"
          width="unset"
        >
          <Text
            alignment="left"
            fontFamily="amazonEmber"
            children="Report ID"
            type="h100"
          ></Text>
          <Text
            alignment="left"
            fontFamily="amazonEmber"
            children="P1022034210"
            type="d50"
          ></Text>
        </Column>
        <Row
          alignmentHorizontal="justify"
          alignmentVertical="top"
          height="unset"
          spacingInset="none none none none"
          spacing="600"
          width="956px"
        >
          <Column
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="none none none none"
            spacing="none"
            width="unset"
          >
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Date Created:"
              type="h100"
            ></Text>
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="05/11/22"
              type="b300"
            ></Text>
          </Column>
          <Column
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="none none none none"
            spacing="none"
            width="unset"
          >
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Channel:"
              type="h100"
            ></Text>
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Flipkart Standard"
              type="b300"
            ></Text>
          </Column>
          <Column
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="none none none none"
            spacing="none"
            width="unset"
          >
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Carrier:"
              type="h100"
            ></Text>
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="EKart Logistics"
              type="b300"
            ></Text>
          </Column>
          <Column
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="none none none none"
            spacing="none"
            width="unset"
          >
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Associate Name:"
              type="h100"
            ></Text>
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Anil Kumar"
              type="b300"
            ></Text>
          </Column>
          <Column
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="none none none none"
            spacing="none"
            width="unset"
          >
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="Vehicle Registration Number:"
              type="h100"
            ></Text>
            <Text
              alignment="left"
              fontFamily="amazonEmber"
              children="KA 04 FN 0210"
              type="b300"
            ></Text>
          </Column>
        </Row>
        <Column
          alignmentHorizontal="start"
          alignmentVertical="top"
          height="unset"
          spacingInset="none none 400 none"
          spacing="400"
          width="956px"
          className={css({
            borderRadius: "4px",
            border: "1px SOLID rgba(190,190,196,1)",
          })}
        >
          <Row
            alignmentHorizontal="start"
            alignmentVertical="center"
            height="unset"
            spacingInset="400 300 400 300"
            spacing="300"
            width="100%"
            className={css({ border: "1px SOLID rgba(190,190,196,1)" })}
          >
            <Row
              alignmentHorizontal="start"
              alignmentVertical="center"
              height="unset"
              spacingInset="none none none none"
              spacing="300"
              width="100%"
            >
              <Text
                alignment="left"
                fontFamily="amazonEmber"
                children="Return Details"
                type="h100"
              ></Text>
            </Row>
          </Row>
          <Column
            alignmentHorizontal="start"
            alignmentVertical="top"
            height="unset"
            spacingInset="none 400 none 400"
            spacing="400"
            width="100%"
          >
            <Row
              alignmentHorizontal="start"
              alignmentVertical="top"
              height="unset"
              spacingInset="none none none none"
              spacing="600"
              width="100%"
            >
              <Row
                alignmentHorizontal="center"
                alignmentVertical="center"
                height="unset"
                spacingInset="none none none none"
                spacing="600"
                width="111px"
              >
                <Column
                  alignmentHorizontal="start"
                  alignmentVertical="center"
                  height="unset"
                  spacingInset="none none none none"
                  spacing="none"
                  width="unset"
                >
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="Delivery OTP"
                    type="h100"
                  ></Text>
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="130258"
                    type="b300"
                  ></Text>
                </Column>
              </Row>
              <Row
                alignmentHorizontal="center"
                alignmentVertical="center"
                height="unset"
                spacingInset="none none none none"
                spacing="600"
                width="111px"
              >
                <Column
                  alignmentHorizontal="start"
                  alignmentVertical="center"
                  height="unset"
                  spacingInset="none none none none"
                  spacing="none"
                  width="unset"
                >
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="Total Scanned:"
                    type="h100"
                  ></Text>
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="2"
                    type="b300"
                  ></Text>
                </Column>
              </Row>
              <Row
                alignmentHorizontal="center"
                alignmentVertical="center"
                height="unset"
                spacingInset="none none none none"
                spacing="600"
                width="100%"
              >
                <Column
                  alignmentHorizontal="start"
                  alignmentVertical="center"
                  height="unset"
                  spacingInset="none none none none"
                  spacing="none"
                  width="100%"
                >
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="Scanned IDs: "
                    type="h100"
                  ></Text>
                  <Text
                    alignment="left"
                    fontFamily="amazonEmber"
                    children="T52381023, T02481052"
                    type="b300"
                  ></Text>
                </Column>
              </Row>
            </Row>
          </Column>
        </Column>
      </Column>
    </Row>
  );
}
SmartHubFrame.propTypes = {};
