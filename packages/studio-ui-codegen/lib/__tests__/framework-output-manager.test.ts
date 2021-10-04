import { MockOutputManager } from './__utils__/mock-classes';

describe('FrameworkOutputManager', () => {
  test('writeComponent', async () => {
    const result = await new MockOutputManager().writeComponent();
    expect(result).toBeUndefined();
  });
});
