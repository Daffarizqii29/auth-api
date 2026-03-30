import { vi } from 'vitest';
import bcrypt from 'bcryptjs';
import BcryptPasswordHash from '../BcryptPasswordHash.js';

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = vi.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toBeCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untuk BcryptPasswordHash
    });
  });
});

describe('comparePassword function', () => {
  it('should not throw AuthenticationError when password matches', async () => {
    const bcryptStub = {
      compare: vi.fn().mockResolvedValue(true)
    };
    const bcryptPasswordHash = new BcryptPasswordHash(bcryptStub);

    await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password')).resolves.not.toThrow();
    expect(bcryptStub.compare).toBeCalledWith('plain_password', 'encrypted_password');
  });

  it('should throw AuthenticationError when bcrypt compare returns false', async () => {
    const bcryptStub = {
      compare: vi.fn().mockResolvedValue(false)
    };
    const bcryptPasswordHash = new BcryptPasswordHash(bcryptStub);

    await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password'))
      .rejects.toThrow('kredensial yang Anda masukkan salah');
  });

  it('should throw AuthenticationError when bcrypt compare throws unexpected error', async () => {
    const bcryptStub = {
      compare: vi.fn().mockRejectedValue(new Error('bcrypt failed'))
    };
    const bcryptPasswordHash = new BcryptPasswordHash(bcryptStub);

    await expect(bcryptPasswordHash.comparePassword('plain_password', 'encrypted_password'))
      .rejects.toThrow('kredensial yang Anda masukkan salah');
  });

  it('should delegate compare function to comparePassword', async () => {
    const bcryptStub = {
      compare: vi.fn().mockResolvedValue(true)
    };
    const bcryptPasswordHash = new BcryptPasswordHash(bcryptStub);
    const spyComparePassword = vi.spyOn(bcryptPasswordHash, 'comparePassword');

    await bcryptPasswordHash.compare('plain_password', 'encrypted_password');

    expect(spyComparePassword).toBeCalledWith('plain_password', 'encrypted_password');
  });
});
