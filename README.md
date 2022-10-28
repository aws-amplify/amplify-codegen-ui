<img src="https://s3.amazonaws.com/aws-mobile-hub-images/aws-amplify-logo.png" alt="AWS Amplify" width="225">

---

# Amplify Codegen UI

[![GitHub](https://img.shields.io/github/license/aws-amplify/amplify-codegen-ui)](LICENSE)
[![Discord](https://img.shields.io/discord/308323056592486420?logo=discord)](https://discord.gg/jWVbPfC)
[![Build](https://github.com/aws-amplify/amplify-codegen-ui/actions/workflows/check.yml/badge.svg)](https://github.com/aws-amplify/amplify-codegen-ui/actions/workflows/check.yml)
[![CircleCI](https://circleci.com/gh/aws-amplify/amplify-codegen-ui/tree/main.svg?style=shield)](https://circleci.com/gh/aws-amplify/amplify-codegen-ui/tree/main)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/aws-amplify/amplify-codegen-ui.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/aws-amplify/amplify-codegen-ui/context:javascript)
[![codecov](https://codecov.io/gh/aws-amplify/amplify-codegen-ui/branch/main/graph/badge.svg?token=opw1LYK6Jn)](https://codecov.io/gh/aws-amplify/amplify-codegen-ui)
[![Open Bugs](https://img.shields.io/github/issues/aws-amplify/amplify-codegen-ui/bug?color=d73a4a&label=bugs)](https://github.com/aws-amplify/amplify-codegen-ui/issues?q=is%3Aissue+is%3Aopen+label%3Abug)
[![Feature Requests](https://img.shields.io/github/issues/aws-amplify/amplify-codegen-ui/feature-request?color=ff9001&label=feature%20requests)](https://github.com/aws-amplify/amplify-codegen-ui/issues?q=is%3Aissue+label%3Afeature-request+is%3Aopen)

Generate React components for use in an AWS Amplify project..

## Usage

Amplify Codegen UI supports component generation in Node or a browser environment.

### Generate in Node

#### Components

```js
import {
  AmplifyRenderer,
  StudioTemplateRendererFactory,
  StudioTemplateRendererManager,
} from '@aws-amplify/codegen-ui-react';

const renderConfig = {};
const outputConfig = {
  outputPathDir: './src/ui-components';
};

const componentRendererFactory = new StudioTemplateRendererFactory(
  (component) => new AmplifyRenderer(component, renderConfig),
);

const rendererManager = new StudioTemplateRendererManager(componentRendererFactory, outputConfig);

const component = {
  id: '1234-5678-9010',
  componentType: 'Text',
  name: 'TextPrimitive',
  properties: {
    label: {
      value: 'Hello world',
    },
  },
};

rendererManager.renderSchemaToTemplate(component);
```

#### Themes

```js
import {
  ReactThemeStudioTemplateRenderer,
  StudioTemplateRendererFactory,
  StudioTemplateRendererManager,
} from '@aws-amplify/codegen-ui-react';

const renderConfig = {};
const outputConfig = {
  outputPathDir: './src/ui-components';
};

const themeRendererFactory = new StudioTemplateRendererFactory(
  (theme) => new ReactThemeStudioTemplateRenderer(theme, renderConfig),
);

const themeRendererManager = new StudioTemplateRendererManager(themeRendererFactory, outputConfig);

const theme = {
  id: '1234-5678-9010',
  name: 'MyTheme',
  values: [
    {
      key: 'tokens',
      value: {
        children: [
          {
            key: 'colors',
            value: {
              children: [
                {
                  key: 'font',
                  value: {
                    children: [
                      {
                        key: 'primary',
                        value: {
                          children: [
                            {
                              key: 'value',
                              value: {
                                value: '#008080',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

themeRendererManager.renderSchemaToTemplate(theme);
```

#### `index.js` File

```js
import {
  ReactIndexStudioTemplateRenderer,
  StudioTemplateRendererFactory,
  StudioTemplateRendererManager,
} from '@aws-amplify/codegen-ui-react';

const renderConfig = {};
const outputConfig = {
  outputPathDir: './src/ui-components',
};

const indexRendererFactory = new StudioTemplateRendererFactory(
  (components) => new ReactIndexStudioTemplateRenderer(components, renderConfig),
);

const indexRendererManager = new StudioTemplateRendererManager(indexRendererFactory, outputConfig);

const components = [
  {
    id: '1234-5678-9010',
    componentType: 'Text',
    name: 'MyHelloWorld',
    properties: {
      label: {
        value: 'Hello world!',
      },
    },
  },
  {
    id: '1234-5678-9012',
    componentType: 'Text',
    name: 'MyCodegen',
    properties: {
      label: {
        value: 'Codegen!',
      },
    },
  },
];

indexRendererManager.renderSchemaToTemplate(components);
```

### Generate in Browser

When generating components in the browser, components will not be written to the file system.

#### Components

```js
import { AmplifyRenderer } from '@aws-amplify/codegen-ui-react';

const renderConfig = {};

const component = {
  id: '1234-5678-9010',
  componentType: 'Text',
  name: 'TextPrimitive',
  properties: {
    label: {
      value: 'Hello world',
    },
  },
};

const { importsText, compText } = new AmplifyRenderer(component, renderConfig).renderComponentOnly();
```

#### Themes

```js
import { ReactThemeStudioTemplateRenderer } from '@aws-amplify/codegen-ui-react';

const renderConfig = {};

const theme = {
  id: '1234-5678-9010',
  name: 'MyTheme',
  values: [
    {
      key: 'tokens',
      value: {
        children: [
          {
            key: 'colors',
            value: {
              children: [
                {
                  key: 'font',
                  value: {
                    children: [
                      {
                        key: 'primary',
                        value: {
                          children: [
                            {
                              key: 'value',
                              value: {
                                value: '#008080',
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const { componentText } = new ReactThemeStudioTemplateRenderer(theme, renderConfig).renderComponent();
```

#### `index.js` File

```js
import { ReactIndexStudioTemplateRenderer } from '@aws-amplify/codegen-ui-react';

const renderConfig = {};
const components = [
  {
    id: '1234-5678-9010',
    componentType: 'Text',
    name: 'MyHelloWorld',
    properties: {
      label: {
        value: 'Hello world!',
      },
    },
  },
  {
    id: '1234-5678-9012',
    componentType: 'Text',
    name: 'MyCodegen',
    properties: {
      label: {
        value: 'CodeGen',
      },
    },
  },
];

const { componentText } = new ReactIndexStudioTemplateRenderer(components, renderConfig);
```

### Config

#### Output Config

##### outputPathDir (Required)

The directory generated components are written to.

```js
const outputConfig = {
  outputPathDir: './src/ui-components',
};
```

#### Render Config

##### script

The script kind (JSX, TSX, etc.) of generated components.

Default: `TSX`
Allowed: `TSX`, `JSX`, `JS`

```js
import { ScriptKind } from '@aws-amplify/codegen-ui-react';

const renderConfig = {
  script: ScriptKind.JSX,
};
```

##### target

The EcmaScript version (ES2016, ESNext, etc.) of generated components.

Default: `ES2015`
Allowed: `ES3`, `ES5`, `ES6`/`ES2015`, `ES2016`, `ES2017`, `ES2018`, `ES2019`, `ES2020`, `ES2021`, `ESNext`

```js
import { ScriptTarget } from '@aws-amplify/codegen-ui-react';

const renderConfig = {
  target: ScriptTaget.ESNext,
};
```

##### module

The JavaScript module system of generated components.

Default: `CommonJS`
Allowed: `CommonJS`, `ESNext`

```js
import { ScriptTarget } from '@aws-amplify/codegen-ui-react';

const renderConfig = {
  module: ModuleKind.ESNext,
};
```

##### renderTypeDeclarations

Generate the type declaration files (`.d.ts`) for components.

Default: `false`
Allowed: `false`, `true`

Rendering type declarations will negatively affect performance.
Only generate type declarations if necessary.

Not supported in browser environments.

```js
const renderConfig = {
  renderTypeDeclarations: true,
};
```

## Contributing

[CONTRIBUTING.md](/CONTRIBUTING.md)
