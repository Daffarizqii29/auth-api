import { describe, it, expect, vi, afterEach } from 'vitest';

describe('config', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('dotenv');

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it('should load default dotenv config when NODE_ENV is not test', async () => {
    const configMock = vi.fn();

    process.env.NODE_ENV = 'development';

    vi.doMock('dotenv', () => ({
      default: {
        config: configMock,
      },
      config: configMock,
    }));

    vi.resetModules();
    await import('../config.js');

    expect(configMock).toBeCalledTimes(1);
  });

  it('should load test dotenv config when NODE_ENV is test', async () => {
    const configMock = vi.fn();

    process.env.NODE_ENV = 'test';

    vi.doMock('dotenv', () => ({
      default: {
        config: configMock,
      },
      config: configMock,
    }));

    vi.resetModules();
    await import('../config.js');

    expect(configMock).toBeCalledTimes(1);
    expect(configMock).toBeCalledWith({
      path: expect.stringContaining('.test.env'),
    });
  });

  it('should load dotenv config when NODE_ENV is undefined', async () => {
    const configMock = vi.fn();

    delete process.env.NODE_ENV;

    vi.doMock('dotenv', () => ({
      default: {
        config: configMock,
      },
      config: configMock,
    }));

    vi.resetModules();
    await import('../config.js');

    expect(configMock).toBeCalledTimes(1);
  });

  it('should set production config correctly', async () => {
    const configMock = vi.fn();

    process.env.NODE_ENV = 'production';

    vi.doMock('dotenv', () => ({
      default: {
        config: configMock,
      },
      config: configMock,
    }));

    vi.resetModules();
    const config = await import('../config.js');

    expect(config.default.app.host).toBe('0.0.0.0');
    expect(config.default.app.debug).toEqual({});
  });
});