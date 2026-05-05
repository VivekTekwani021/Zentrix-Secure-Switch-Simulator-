const { encrypt, decrypt } = require('../middleware/encryption');
const crypto = require('crypto');

describe('Encryption Middleware', () => {
  const masterKey = crypto.randomBytes(32).toString('hex');
  const sampleText = 'Hello Zentrix';

  test('should encrypt and decrypt data correctly', () => {
    const { iv, encryptedData } = encrypt(sampleText, masterKey);
    
    expect(iv).toBeDefined();
    expect(encryptedData).toBeDefined();
    expect(encryptedData).not.toBe(sampleText);

    const decrypted = decrypt(encryptedData, masterKey, iv);
    expect(decrypted).toBe(sampleText);
  });

  test('should fail decryption with wrong key', () => {
    const { iv, encryptedData } = encrypt(sampleText, masterKey);
    const wrongKey = crypto.randomBytes(32).toString('hex');
    
    const decrypted = decrypt(encryptedData, wrongKey, iv);
    expect(decrypted).toMatch(/Error:/);
  });

  test('should fail decryption with corrupted data', () => {
    const { iv } = encrypt(sampleText, masterKey);
    const corruptedData = 'abcdef123456';
    
    const decrypted = decrypt(corruptedData, masterKey, iv);
    expect(decrypted).toMatch(/Error:/);
  });
});
