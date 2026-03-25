const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

// Encryption engine
function encrypt(text, hexKey) {
  const key = Buffer.from(hexKey, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}

// Decryption engine
function decrypt(encryptedText, hexKey, hexIv) {
  try {
    const key = Buffer.from(hexKey, 'hex');
    const iv = Buffer.from(hexIv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return "Error: Decryption Failed (Invalid Key/Data)";
  }
}

module.exports = { encrypt, decrypt };
