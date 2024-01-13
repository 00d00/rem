const crypto = require('crypto');


module.exports = {
  // 暗号化関数
  encrypt: (data) => {
    const cipher = crypto.createCipher('aes-256-ecb', process.env.ENCRYPT_KEY);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  },
  // 復号化関数
  decrypt: (data) => {
    const decipher = crypto.createDecipher('aes-256-ecb', process.env.ENCRYPT_KEY);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
  }
};