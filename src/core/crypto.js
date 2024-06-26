
var crypto = require('crypto');
const CryptoJS = require("crypto-js");
var { generateKeyPairSync, } = require('crypto-js');
var encryptionMethod = 'AES-256-CBC';
var secret = "7pp0OERpjFs3nRDWNKmkNCSQH9gjvDum";

 class Crypto {
    constructor() {
        this.key = CryptoJS.enc.Utf8.parse('7061737323313233');
        this.iv = CryptoJS.enc.Utf8.parse('7061737323313233');
    }
    encrypt(data, is_password) {
        if (is_password) {
            let hash = CryptoJS.HmacSHA256(data, this.key);
            return CryptoJS.enc.Base64.stringify(hash);
        }
        else {
            return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), this.key, {
                keySize: 64 / 8,
                iv: this.iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
        }
    }
    decrypt(encrypted) {
        var byteCode = CryptoJS.AES.decrypt(encrypted, this.key, {
            keySize: 128 / 8,
            iv: this.iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var decryptedString = byteCode.toString(CryptoJS.enc.Utf8);
        let obj = { 'decrypt_code': byteCode, 'value': decryptedString };
        return (typeof JSON.parse(decryptedString) === 'object' && decryptedString !== null) ? decryptedString : false;
    }
     encodeData(key, data) {
        try {
            const buffer = Buffer.from(JSON.stringify(data), 'utf8')
            const encrypted = crypto.publicEncrypt(key, buffer)
            return encrypted.toString('base64');
        } catch (err) {
            throw new Error(err.message)
        }
    }
 decodeData(key, token) {
    console.log(key);
    console.log(token);
        try {
            const buffer = Buffer.from(token, 'base64')
            const decrypted = CryptoJS.AES.privateDecrypt({
                key: key.toString(),
                passphrase: 'SM',
            }, buffer)
            return JSON.parse(decrypted.toString('utf8'));
        } catch (err) {
            throw new Error(err.message)
        }
    }
    aesDecrypt(cipherText, key) {
    console.log(key);
    console.log(cipherText);
        try {
           const iv = key.substring(0, 16) 
           return CryptoJS.AES.decrypt(cipherText,  CryptoJS.enc.Utf8.parse(key), { iv:  CryptoJS.enc.Utf8.parse(iv), }) .toString( CryptoJS.enc.Utf8)
        } catch (err) {
            throw new Error(err.message)
        }
    }
}
module.exports = Crypto;