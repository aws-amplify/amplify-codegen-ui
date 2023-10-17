import { AmplifyRenderer, AmplifyMeridianRenderer } from '@aws-amplify/codegen-ui-react';
import { StudioTemplateRendererFactory, StudioTemplateRendererManager } from '@aws-amplify/codegen-ui';
import { StudioComponent } from '@aws-amplify/codegen-ui';
import { ScriptKind } from 'typescript';

const renderConfig = { script: ScriptKind.JSX };
const outputConfig = {
  outputPathDir: './src/components',
};

const component = {
  "name": "SmartHubFrame",
  "children": [{
      "children": [{
          "children": [{
              "children": [],
              "name": "spacer",
              "componentType": "View",
              "properties": {
                  "width": {
                      "value": "1px"
                  },
                  "height": {
                      "value": "8px"
                  },
                  "display": {
                      "value": "block"
                  },
                  "gap": {
                      "value": "unset"
                  },
                  "alignItems": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "unset"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  },
                  "backgroundColor": {
                      "value": "rgba(255,255,255,1)"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;636:24455",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Meridian logo",
                      "componentType": "Flex",
                      "properties": {
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "width": {
                              "value": "0px"
                          },
                          "height": {
                              "value": "0px"
                          },
                          "display": {
                              "value": "block"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;636:24458",
                      "designSystem": "MERIDIAN"
                  }, {
                      "children": [],
                      "name": "Meridian Design System",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "32px"
                          },
                          "label": {
                              "value": "SmartHub"
                          },
                          "fontWeight": {
                              "value": "400"
                          },
                          "color": {
                              "value": "rgba(2,8,14,1)"
                          },
                          "lineHeight": {
                              "value": "40px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "letterSpacing": {
                              "value": "1.85px"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;636:24466",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Logo and type",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "15px"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "I838:490;636:24457",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Header contents",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "17px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-end"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;636:24456",
              "designSystem": "MERIDIAN"
          }],
          "name": "Header",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "unset"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "center"
              },
              "shrink": {
                  "value": "0"
              },
              "alignSelf": {
                  "value": "stretch"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "12px 16px 12px 16px"
              },
              "backgroundColor": {
                  "value": "rgba(255,255,255,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "I838:490;636:24454",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [],
              "name": "Selector spaceri83849079814912",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "12px"
                  },
                  "height": {
                      "value": "40px"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 4px 0px 4px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:14912",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Labeli83849079814917",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "16px"
                          },
                          "label": {
                              "value": "Orders"
                          },
                          "fontWeight": {
                              "value": "400"
                          },
                          "color": {
                              "value": "rgba(2,8,14,1)"
                          },
                          "lineHeight": {
                              "value": "24px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "24px"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "grow": {
                              "value": "1"
                          },
                          "shrink": {
                              "value": "1"
                          },
                          "basis": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;798:14917",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Labeli83849079814916",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "0"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "40px"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "I838:490;798:14916",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Icon and labeli83849079814913",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 10px 0px 12px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:14913",
              "designSystem": "MERIDIAN"
          }],
          "name": "Side menu itemsi83849079814911",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "264px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              },
              "backgroundColor": {
                  "value": "rgba(255,255,255,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "I838:490;798:14911",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [],
              "name": "Selector spaceri83849079815067",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "12px"
                  },
                  "height": {
                      "value": "40px"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 4px 0px 4px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15067",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Labeli83849079815072",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "16px"
                          },
                          "label": {
                              "value": "Returns"
                          },
                          "fontWeight": {
                              "value": "400"
                          },
                          "color": {
                              "value": "rgba(2,8,14,1)"
                          },
                          "lineHeight": {
                              "value": "24px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "24px"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "grow": {
                              "value": "1"
                          },
                          "shrink": {
                              "value": "1"
                          },
                          "basis": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;798:15072",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Labeli83849079815071",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "0"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "40px"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "I838:490;798:15071",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Icon and labeli83849079815068",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 10px 0px 12px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15068",
              "designSystem": "MERIDIAN"
          }],
          "name": "Side menu itemsi83849079815066",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "264px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              },
              "backgroundColor": {
                  "value": "rgba(255,255,255,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "I838:490;798:15066",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [],
              "name": "Selector spaceri83849079815222",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "12px"
                  },
                  "height": {
                      "value": "40px"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 4px 0px 4px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15222",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Labeli83849079815227",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "16px"
                          },
                          "label": {
                              "value": "Products"
                          },
                          "fontWeight": {
                              "value": "400"
                          },
                          "color": {
                              "value": "rgba(2,8,14,1)"
                          },
                          "lineHeight": {
                              "value": "24px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "24px"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "grow": {
                              "value": "1"
                          },
                          "shrink": {
                              "value": "1"
                          },
                          "basis": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;798:15227",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Labeli83849079815226",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "0"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "40px"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "I838:490;798:15226",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Icon and labeli83849079815223",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 10px 0px 12px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15223",
              "designSystem": "MERIDIAN"
          }],
          "name": "Side menu itemsi83849079815221",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "264px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              },
              "backgroundColor": {
                  "value": "rgba(255,255,255,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "I838:490;798:15221",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [],
              "name": "Selector spaceri83849079815377",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "12px"
                  },
                  "height": {
                      "value": "40px"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 4px 0px 4px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15377",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Labeli83849079815382",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "16px"
                          },
                          "label": {
                              "value": "Inventory"
                          },
                          "fontWeight": {
                              "value": "400"
                          },
                          "color": {
                              "value": "rgba(2,8,14,1)"
                          },
                          "lineHeight": {
                              "value": "24px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "24px"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "grow": {
                              "value": "1"
                          },
                          "shrink": {
                              "value": "1"
                          },
                          "basis": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I838:490;798:15382",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Labeli83849079815381",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "0"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "40px"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "I838:490;798:15381",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Icon and labeli83849079815378",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 10px 0px 12px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "I838:490;798:15378",
              "designSystem": "MERIDIAN"
          }],
          "name": "Side menu itemsi83849079815376",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "264px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              },
              "backgroundColor": {
                  "value": "rgba(255,255,255,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "I838:490;798:15376",
          "designSystem": "MERIDIAN"
      }],
      "name": "SideMenu",
      "componentType": "SideMenu",
      "properties": {
          "display": {
              "value": "flex"
          },
          "gap": {
              "value": "0"
          },
          "direction": {
              "value": "column"
          },
          "width": {
              "value": "Default"
          },
          "height": {
              "value": "840px"
          },
          "justifyContent": {
              "value": "flex-start"
          },
          "alignItems": {
              "value": "flex-start"
          },
          "overflow": {
              "value": "hidden"
          },
          "shrink": {
              "value": "0"
          },
          "position": {
              "value": "relative"
          },
          "border": {
              "value": "1px SOLID rgba(204,213,222,1)"
          },
          "padding": {
              "value": "0px 0px 0px 0px"
          },
          "backgroundColor": {
              "value": "rgba(255,255,255,1)"
          }
      },
      "overrides": {
          "Labeli83849079814916": {
              "shrink": "1",
              "padding": "0px 0px 0px 0px",
              "grow": "1",
              "basis": "0"
          },
          "Labeli83849079815071": {
              "shrink": "1",
              "padding": "0px 0px 0px 0px",
              "grow": "1",
              "basis": "0"
          },
          "Labeli83849079815226": {
              "shrink": "1",
              "padding": "0px 0px 0px 0px",
              "grow": "1",
              "basis": "0"
          },
          "Labeli83849079815381": {
              "shrink": "1",
              "padding": "0px 0px 0px 0px",
              "grow": "1",
              "basis": "0"
          }
      },
      "variants": [],
      "events": {},
      "sourceId": "838:490",
      "designSystem": "MERIDIAN"
  }, {
      "children": [{
          "children": [{
              "children": [{
                  "children": [{
                      "children": [{
                          "children": [],
                          "name": "Level 1",
                          "componentType": "Text",
                          "properties": {
                              "fontFamily": {
                                  "value": "Amazon Ember"
                              },
                              "fontSize": {
                                  "value": "16px"
                              },
                              "label": {
                                  "value": "All Returns"
                              },
                              "fontWeight": {
                                  "value": "400"
                              },
                              "color": {
                                  "value": "rgba(7,115,152,1)"
                              },
                              "lineHeight": {
                                  "value": "20px"
                              },
                              "textAlign": {
                                  "value": "left"
                              },
                              "display": {
                                  "value": "block"
                              },
                              "direction": {
                                  "value": "column"
                              },
                              "justifyContent": {
                                  "value": "unset"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "gap": {
                                  "value": "unset"
                              },
                              "alignItems": {
                                  "value": "unset"
                              },
                              "shrink": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              },
                              "whiteSpace": {
                                  "value": "pre-wrap"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "I795:9523;681:18965",
                          "designSystem": "MERIDIAN"
                      }, {
                          "children": [],
                          "name": "Chevron 1",
                          "componentType": "Row",
                          "properties": {
                              "display": {
                                  "value": "flex"
                              },
                              "gap": {
                                  "value": "10px"
                              },
                              "direction": {
                                  "value": "row"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "justifyContent": {
                                  "value": "flex-start"
                              },
                              "alignItems": {
                                  "value": "flex-start"
                              },
                              "overflow": {
                                  "value": "hidden"
                              },
                              "shrink": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "I795:9523;681:18966",
                          "designSystem": "MERIDIAN"
                      }, {
                          "children": [],
                          "name": "Level 2",
                          "componentType": "Text",
                          "properties": {
                              "fontFamily": {
                                  "value": "Amazon Ember"
                              },
                              "fontSize": {
                                  "value": "16px"
                              },
                              "label": {
                                  "value": "POD Report"
                              },
                              "fontWeight": {
                                  "value": "400"
                              },
                              "color": {
                                  "value": "rgba(35,47,62,1)"
                              },
                              "lineHeight": {
                                  "value": "20px"
                              },
                              "textAlign": {
                                  "value": "left"
                              },
                              "display": {
                                  "value": "block"
                              },
                              "direction": {
                                  "value": "column"
                              },
                              "justifyContent": {
                                  "value": "unset"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "gap": {
                                  "value": "unset"
                              },
                              "alignItems": {
                                  "value": "unset"
                              },
                              "shrink": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              },
                              "whiteSpace": {
                                  "value": "pre-wrap"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "I795:9523;681:18967",
                          "designSystem": "MERIDIAN"
                      }],
                      "name": "Frame 1",
                      "componentType": "Row",
                      "properties": {
                          "display": {
                              "value": "flex"
                          },
                          "gap": {
                              "value": "4px"
                          },
                          "direction": {
                              "value": "row"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "justifyContent": {
                              "value": "flex-start"
                          },
                          "alignItems": {
                              "value": "center"
                          },
                          "position": {
                              "value": "absolute"
                          },
                          "top": {
                              "value": "0px"
                          },
                          "left": {
                              "value": "0px"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "I795:9523;681:18964",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Breadcrumb",
                  "componentType": "Breadcrumb",
                  "properties": {
                      "height": {
                          "value": "20px"
                      },
                      "display": {
                          "value": "block"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "level": {
                          "value": "2"
                      }
                  },
                  "overrides": {
                      "Chevron 1": {
                          "gap": "10px",
                          "alignItems": "flex-start",
                          "overflow": "hidden",
                          "shrink": "0",
                          "position": "relative"
                      }
                  },
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9523",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [{
                      "children": [],
                      "name": "Pick",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "48px"
                          },
                          "label": {
                              "value": "POD Report"
                          },
                          "fontWeight": {
                              "value": "300"
                          },
                          "color": {
                              "value": "rgba(37,48,62,1)"
                          },
                          "lineHeight": {
                              "value": "60px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "795:9525",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Frame 364",
                  "componentType": "Column",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "8px"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "flex-start"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9524",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 271",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "16px"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "grow": {
                      "value": "1"
                  },
                  "shrink": {
                      "value": "1"
                  },
                  "basis": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9522",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [],
                  "name": "Button7959527",
                  "componentType": "Button",
                  "properties": {
                      "width": {
                          "value": "unset"
                      },
                      "label": {
                          "value": "View All Reports"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "type": {
                          "value": "Link"
                      },
                      "size": {
                          "value": "Large"
                      },
                      "state": {
                          "value": "Default"
                      },
                      "example": {
                          "value": "Text and icon"
                      }
                  },
                  "overrides": {
                      "Label": {
                          "fontSize": "18px",
                          "color": "rgba(0,104,141,1)",
                          "lineHeight": "28px",
                          "textAlign": "left"
                      }
                  },
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9527",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "Button7959528",
                  "componentType": "Button",
                  "properties": {
                      "width": {
                          "value": "unset"
                      },
                      "label": {
                          "value": "Print Report"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "type": {
                          "value": "Primary"
                      },
                      "size": {
                          "value": "Medium"
                      },
                      "state": {
                          "value": "Default"
                      },
                      "example": {
                          "value": "Text and icon"
                      }
                  },
                  "overrides": {
                      "Label": {
                          "fontSize": "16px",
                          "lineHeight": "24px",
                          "textAlign": "left"
                      }
                  },
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9528",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 272",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9526",
              "designSystem": "MERIDIAN"
          }],
          "name": "Frame 269",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "12px"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "1047px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-end"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "border": {
                  "value": "1px SOLID rgba(231,233,233,1)"
              },
              "padding": {
                  "value": "31px 31px 31px 31px"
              },
              "backgroundColor": {
                  "value": "rgba(249,250,250,1)"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "795:9521",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [],
              "name": "Report ID",
              "componentType": "Text",
              "properties": {
                  "fontFamily": {
                      "value": "Amazon Ember"
                  },
                  "fontSize": {
                      "value": "16px"
                  },
                  "label": {
                      "value": "Report ID"
                  },
                  "fontWeight": {
                      "value": "700"
                  },
                  "color": {
                      "value": "rgba(37,48,62,1)"
                  },
                  "lineHeight": {
                      "value": "20px"
                  },
                  "textAlign": {
                      "value": "left"
                  },
                  "display": {
                      "value": "block"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "justifyContent": {
                      "value": "unset"
                  },
                  "width": {
                      "value": "157.42px"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "gap": {
                      "value": "unset"
                  },
                  "alignItems": {
                      "value": "unset"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  },
                  "whiteSpace": {
                      "value": "pre-wrap"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9530",
              "designSystem": "MERIDIAN"
          }, {
              "children": [],
              "name": "P1022034210",
              "componentType": "Text",
              "properties": {
                  "fontFamily": {
                      "value": "Amazon Ember"
                  },
                  "fontSize": {
                      "value": "36px"
                  },
                  "label": {
                      "value": "P1022034210"
                  },
                  "fontWeight": {
                      "value": "300"
                  },
                  "color": {
                      "value": "rgba(37,48,62,1)"
                  },
                  "lineHeight": {
                      "value": "48px"
                  },
                  "textAlign": {
                      "value": "left"
                  },
                  "display": {
                      "value": "block"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "justifyContent": {
                      "value": "unset"
                  },
                  "width": {
                      "value": "343px"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "gap": {
                      "value": "unset"
                  },
                  "alignItems": {
                      "value": "unset"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  },
                  "whiteSpace": {
                      "value": "pre-wrap"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9531",
              "designSystem": "MERIDIAN"
          }],
          "name": "Frame 155",
          "componentType": "Column",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "0"
              },
              "direction": {
                  "value": "column"
              },
              "width": {
                  "value": "unset"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "795:9529",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [{
                  "children": [],
                  "name": "Date Created:",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Date Created:"
                      },
                      "fontWeight": {
                          "value": "700"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "20px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9534",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "05/11/22",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "05/11/22"
                      },
                      "fontWeight": {
                          "value": "400"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "24px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9535",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 374",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "0"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9533",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [],
                  "name": "Channel:",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Channel:"
                      },
                      "fontWeight": {
                          "value": "700"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "20px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9537",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "Flipkart Standard",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Flipkart Standard"
                      },
                      "fontWeight": {
                          "value": "400"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "24px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9538",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 370",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "0"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9536",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [],
                  "name": "Carrier:",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Carrier:"
                      },
                      "fontWeight": {
                          "value": "700"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "20px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9540",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "EKart Logistics",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "EKart Logistics"
                      },
                      "fontWeight": {
                          "value": "400"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "24px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9541",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 371",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "0"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9539",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [],
                  "name": "Associate Name:",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Associate Name:"
                      },
                      "fontWeight": {
                          "value": "700"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "20px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9544",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "Anil Kumar",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Anil Kumar"
                      },
                      "fontWeight": {
                          "value": "400"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "24px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9543",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 372",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "0"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9542",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [],
                  "name": "Vehicle Registration Number:",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "Vehicle Registration Number:"
                      },
                      "fontWeight": {
                          "value": "700"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "20px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9546",
                  "designSystem": "MERIDIAN"
              }, {
                  "children": [],
                  "name": "KA 04 FN 0210",
                  "componentType": "Text",
                  "properties": {
                      "fontFamily": {
                          "value": "Amazon Ember"
                      },
                      "fontSize": {
                          "value": "16px"
                      },
                      "label": {
                          "value": "KA 04 FN 0210"
                      },
                      "fontWeight": {
                          "value": "400"
                      },
                      "color": {
                          "value": "rgba(37,48,62,1)"
                      },
                      "lineHeight": {
                          "value": "24px"
                      },
                      "textAlign": {
                          "value": "left"
                      },
                      "display": {
                          "value": "block"
                      },
                      "direction": {
                          "value": "column"
                      },
                      "justifyContent": {
                          "value": "unset"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "gap": {
                          "value": "unset"
                      },
                      "alignItems": {
                          "value": "unset"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      },
                      "whiteSpace": {
                          "value": "pre-wrap"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9547",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 373",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "0"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "center"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 0px 0px 0px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9545",
              "designSystem": "MERIDIAN"
          }],
          "name": "Frame 151",
          "componentType": "Row",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "60px"
              },
              "direction": {
                  "value": "row"
              },
              "width": {
                  "value": "956px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "space-between"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "padding": {
                  "value": "0px 0px 0px 0px"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "795:9532",
          "designSystem": "MERIDIAN"
      }, {
          "children": [{
              "children": [{
                  "children": [{
                      "children": [],
                      "name": "Return Details",
                      "componentType": "Text",
                      "properties": {
                          "fontFamily": {
                              "value": "Amazon Ember"
                          },
                          "fontSize": {
                              "value": "16px"
                          },
                          "label": {
                              "value": "Return Details"
                          },
                          "fontWeight": {
                              "value": "700"
                          },
                          "color": {
                              "value": "rgba(37,48,62,1)"
                          },
                          "lineHeight": {
                              "value": "20px"
                          },
                          "textAlign": {
                              "value": "left"
                          },
                          "display": {
                              "value": "block"
                          },
                          "direction": {
                              "value": "column"
                          },
                          "justifyContent": {
                              "value": "unset"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "gap": {
                              "value": "unset"
                          },
                          "alignItems": {
                              "value": "unset"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          },
                          "whiteSpace": {
                              "value": "pre-wrap"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "795:9551",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Frame 334",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "8px"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "center"
                      },
                      "grow": {
                          "value": "1"
                      },
                      "shrink": {
                          "value": "1"
                      },
                      "basis": {
                          "value": "0"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9550",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 326",
              "componentType": "Row",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "8px"
                  },
                  "direction": {
                      "value": "row"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "center"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "alignSelf": {
                      "value": "stretch"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "border": {
                      "value": "1px SOLID rgba(190,190,196,1)"
                  },
                  "padding": {
                      "value": "15px 11px 15px 11px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9549",
              "designSystem": "MERIDIAN"
          }, {
              "children": [{
                  "children": [{
                      "children": [{
                          "children": [{
                              "children": [],
                              "name": "Delivery OTP",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "Delivery OTP"
                                  },
                                  "fontWeight": {
                                      "value": "700"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "20px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9556",
                              "designSystem": "MERIDIAN"
                          }, {
                              "children": [],
                              "name": "130258",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "130258"
                                  },
                                  "fontWeight": {
                                      "value": "400"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "24px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9557",
                              "designSystem": "MERIDIAN"
                          }],
                          "name": "Frame 3657959555",
                          "componentType": "Column",
                          "properties": {
                              "display": {
                                  "value": "flex"
                              },
                              "gap": {
                                  "value": "0"
                              },
                              "direction": {
                                  "value": "column"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "justifyContent": {
                                  "value": "center"
                              },
                              "alignItems": {
                                  "value": "flex-start"
                              },
                              "shrink": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "795:9555",
                          "designSystem": "MERIDIAN"
                      }],
                      "name": "Frame 401",
                      "componentType": "Row",
                      "properties": {
                          "display": {
                              "value": "flex"
                          },
                          "gap": {
                              "value": "69px"
                          },
                          "direction": {
                              "value": "row"
                          },
                          "width": {
                              "value": "111px"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "justifyContent": {
                              "value": "center"
                          },
                          "alignItems": {
                              "value": "center"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "795:9554",
                      "designSystem": "MERIDIAN"
                  }, {
                      "children": [{
                          "children": [{
                              "children": [],
                              "name": "Total Scanned:",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "Total Scanned:"
                                  },
                                  "fontWeight": {
                                      "value": "700"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "20px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9560",
                              "designSystem": "MERIDIAN"
                          }, {
                              "children": [],
                              "name": "2",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "2"
                                  },
                                  "fontWeight": {
                                      "value": "400"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "24px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9561",
                              "designSystem": "MERIDIAN"
                          }],
                          "name": "Frame 3657959559",
                          "componentType": "Column",
                          "properties": {
                              "display": {
                                  "value": "flex"
                              },
                              "gap": {
                                  "value": "0"
                              },
                              "direction": {
                                  "value": "column"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "justifyContent": {
                                  "value": "center"
                              },
                              "alignItems": {
                                  "value": "flex-start"
                              },
                              "shrink": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "795:9559",
                          "designSystem": "MERIDIAN"
                      }],
                      "name": "Frame 399",
                      "componentType": "Row",
                      "properties": {
                          "display": {
                              "value": "flex"
                          },
                          "gap": {
                              "value": "69px"
                          },
                          "direction": {
                              "value": "row"
                          },
                          "width": {
                              "value": "111px"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "justifyContent": {
                              "value": "center"
                          },
                          "alignItems": {
                              "value": "center"
                          },
                          "shrink": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "795:9558",
                      "designSystem": "MERIDIAN"
                  }, {
                      "children": [{
                          "children": [{
                              "children": [],
                              "name": "Scanned IDs:",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "Scanned IDs: "
                                  },
                                  "fontWeight": {
                                      "value": "700"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "20px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9564",
                              "designSystem": "MERIDIAN"
                          }, {
                              "children": [],
                              "name": "T52381023, T02481052",
                              "componentType": "Text",
                              "properties": {
                                  "fontFamily": {
                                      "value": "Amazon Ember"
                                  },
                                  "fontSize": {
                                      "value": "16px"
                                  },
                                  "label": {
                                      "value": "T52381023, T02481052"
                                  },
                                  "fontWeight": {
                                      "value": "400"
                                  },
                                  "color": {
                                      "value": "rgba(37,48,62,1)"
                                  },
                                  "lineHeight": {
                                      "value": "24px"
                                  },
                                  "textAlign": {
                                      "value": "left"
                                  },
                                  "display": {
                                      "value": "block"
                                  },
                                  "direction": {
                                      "value": "column"
                                  },
                                  "justifyContent": {
                                      "value": "unset"
                                  },
                                  "width": {
                                      "value": "unset"
                                  },
                                  "height": {
                                      "value": "unset"
                                  },
                                  "gap": {
                                      "value": "unset"
                                  },
                                  "alignItems": {
                                      "value": "unset"
                                  },
                                  "shrink": {
                                      "value": "0"
                                  },
                                  "position": {
                                      "value": "relative"
                                  },
                                  "padding": {
                                      "value": "0px 0px 0px 0px"
                                  },
                                  "whiteSpace": {
                                      "value": "pre-wrap"
                                  }
                              },
                              "overrides": {},
                              "variants": [],
                              "events": {},
                              "sourceId": "795:9565",
                              "designSystem": "MERIDIAN"
                          }],
                          "name": "Frame 3657959563",
                          "componentType": "Column",
                          "properties": {
                              "display": {
                                  "value": "flex"
                              },
                              "gap": {
                                  "value": "0"
                              },
                              "direction": {
                                  "value": "column"
                              },
                              "width": {
                                  "value": "unset"
                              },
                              "height": {
                                  "value": "unset"
                              },
                              "justifyContent": {
                                  "value": "center"
                              },
                              "alignItems": {
                                  "value": "flex-start"
                              },
                              "grow": {
                                  "value": "1"
                              },
                              "shrink": {
                                  "value": "1"
                              },
                              "basis": {
                                  "value": "0"
                              },
                              "position": {
                                  "value": "relative"
                              },
                              "padding": {
                                  "value": "0px 0px 0px 0px"
                              }
                          },
                          "overrides": {},
                          "variants": [],
                          "events": {},
                          "sourceId": "795:9563",
                          "designSystem": "MERIDIAN"
                      }],
                      "name": "Frame 400",
                      "componentType": "Row",
                      "properties": {
                          "display": {
                              "value": "flex"
                          },
                          "gap": {
                              "value": "69px"
                          },
                          "direction": {
                              "value": "row"
                          },
                          "width": {
                              "value": "unset"
                          },
                          "height": {
                              "value": "unset"
                          },
                          "justifyContent": {
                              "value": "center"
                          },
                          "alignItems": {
                              "value": "center"
                          },
                          "grow": {
                              "value": "1"
                          },
                          "shrink": {
                              "value": "1"
                          },
                          "basis": {
                              "value": "0"
                          },
                          "position": {
                              "value": "relative"
                          },
                          "padding": {
                              "value": "0px 0px 0px 0px"
                          }
                      },
                      "overrides": {},
                      "variants": [],
                      "events": {},
                      "sourceId": "795:9562",
                      "designSystem": "MERIDIAN"
                  }],
                  "name": "Frame 497",
                  "componentType": "Row",
                  "properties": {
                      "display": {
                          "value": "flex"
                      },
                      "gap": {
                          "value": "60px"
                      },
                      "direction": {
                          "value": "row"
                      },
                      "width": {
                          "value": "unset"
                      },
                      "height": {
                          "value": "unset"
                      },
                      "justifyContent": {
                          "value": "flex-start"
                      },
                      "alignItems": {
                          "value": "flex-start"
                      },
                      "shrink": {
                          "value": "0"
                      },
                      "alignSelf": {
                          "value": "stretch"
                      },
                      "position": {
                          "value": "relative"
                      },
                      "padding": {
                          "value": "0px 0px 0px 0px"
                      }
                  },
                  "overrides": {},
                  "variants": [],
                  "events": {},
                  "sourceId": "795:9553",
                  "designSystem": "MERIDIAN"
              }],
              "name": "Frame 378",
              "componentType": "Column",
              "properties": {
                  "display": {
                      "value": "flex"
                  },
                  "gap": {
                      "value": "20px"
                  },
                  "direction": {
                      "value": "column"
                  },
                  "width": {
                      "value": "unset"
                  },
                  "height": {
                      "value": "unset"
                  },
                  "justifyContent": {
                      "value": "flex-start"
                  },
                  "alignItems": {
                      "value": "flex-start"
                  },
                  "shrink": {
                      "value": "0"
                  },
                  "alignSelf": {
                      "value": "stretch"
                  },
                  "position": {
                      "value": "relative"
                  },
                  "padding": {
                      "value": "0px 16px 0px 16px"
                  }
              },
              "overrides": {},
              "variants": [],
              "events": {},
              "sourceId": "795:9552",
              "designSystem": "MERIDIAN"
          }],
          "name": "Frame 382",
          "componentType": "Column",
          "properties": {
              "display": {
                  "value": "flex"
              },
              "gap": {
                  "value": "16px"
              },
              "direction": {
                  "value": "column"
              },
              "width": {
                  "value": "956px"
              },
              "height": {
                  "value": "unset"
              },
              "justifyContent": {
                  "value": "flex-start"
              },
              "alignItems": {
                  "value": "flex-start"
              },
              "overflow": {
                  "value": "hidden"
              },
              "shrink": {
                  "value": "0"
              },
              "position": {
                  "value": "relative"
              },
              "border": {
                  "value": "1px SOLID rgba(190,190,196,1)"
              },
              "borderRadius": {
                  "value": "4px"
              },
              "padding": {
                  "value": "0px 0px 19px 0px"
              }
          },
          "overrides": {},
          "variants": [],
          "events": {},
          "sourceId": "795:9548",
          "designSystem": "MERIDIAN"
      }],
      "name": "Frame 499",
      "componentType": "Column",
      "properties": {
          "display": {
              "value": "flex"
          },
          "gap": {
              "value": "10px"
          },
          "direction": {
              "value": "column"
          },
          "width": {
              "value": "1067px"
          },
          "height": {
              "value": "840px"
          },
          "justifyContent": {
              "value": "flex-start"
          },
          "alignItems": {
              "value": "flex-start"
          },
          "overflow": {
              "value": "hidden"
          },
          "shrink": {
              "value": "0"
          },
          "position": {
              "value": "relative"
          },
          "padding": {
              "value": "50px 10px 50px 10px"
          }
      },
      "overrides": {},
      "variants": [],
      "events": {},
      "sourceId": "795:9520",
      "designSystem": "MERIDIAN"
  }],
  "id": "795:9630",
  "bindingProperties": {},
  "componentType": "Row",
  "properties": {
      "display": {
          "value": "flex"
      },
      "gap": {
          "value": "10px"
      },
      "direction": {
          "value": "row"
      },
      "width": {
          "value": "unset"
      },
      "height": {
          "value": "unset"
      },
      "justifyContent": {
          "value": "flex-start"
      },
      "alignItems": {
          "value": "flex-start"
      },
      "overflow": {
          "value": "hidden"
      },
      "position": {
          "value": "relative"
      },
      "padding": {
          "value": "0px 0px 0px 0px"
      },
      "backgroundColor": {
          "value": "rgba(255,255,255,1)"
      }
  },
  "overrides": {},
  "variants": [],
  "events": {},
  "schemaVersion": "1.0",
  "sourceId": "795:9630",
  "designSystem": "MERIDIAN"
};

const componentRendererFactory = new StudioTemplateRendererFactory(
  (component) => new AmplifyMeridianRenderer(component as StudioComponent, renderConfig),
);

const rendererManager = new StudioTemplateRendererManager(componentRendererFactory, outputConfig);

rendererManager.renderSchemaToTemplate(component);
