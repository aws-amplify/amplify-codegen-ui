import { FrameworkOutputManager } from '../framework-output-manager';

const func = jest.fn();

class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(input: string, outputPath: string, componentName: string): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

describe('FrameworkOutputManager', () => {
  test('writeComponent', async () => {
    const result = await new MockOutputManager().writeComponent('', '', '');
    expect(result).toBeUndefined();
  });
});
