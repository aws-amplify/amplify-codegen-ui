import { FrameworkOutputManager } from '../framework-output-manager';

class MockOutputManager extends FrameworkOutputManager<string> {
  writeComponent(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

describe('FrameworkOutputManager', () => {
  test('writeComponent', async () => {
    const result = await new MockOutputManager().writeComponent();
    expect(result).toBeUndefined();
  });
});
