import { renderHook, act } from '@testing-library/react-hooks';
import useProgressIndicator from './useProgressIndicator';

describe('the useProgressIndicator hook', () => {
  beforeAll(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            defaultValue: 'test-default-value',
          }),
      })
    );
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    global.fetch.mockRestore();
  });

  it('should update the progress when the "toggleComplete" function is called', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useProgressIndicator(false, 1)
    );

    expect(result.current[0]).toEqual({
      loading: false,
      complete: false,
      error: null,
    });

    act(() => {
      result.current[1](true, 1);
    });

    expect(result.current[0]).toEqual({
      loading: true,
      complete: false,
      error: null,
    });

    await waitForNextUpdate();

    // @todo: Include some test that ensures that the appropriate API
    // functions are called.

    expect(result.current[0]).toEqual({
      loading: false,
      complete: true,
      error: null,
    });
  });
});
