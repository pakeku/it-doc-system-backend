import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';  // AES algorithm with a 256-bit key
const key = process.env.ENCRYPTION_KEY || ''; // 32 byte key for AES-256
const keyBuffer = Buffer.from(key, 'hex');  // Convert to Buffer

// Ensure key is of proper length (32 bytes for AES-256)
if (keyBuffer.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 bytes (256 bits) long.');
}

// Encryption function
export function encrypt(text: string): { iv: string; encryptedData: string } {
    const iv = crypto.randomBytes(16); // Create an initialization vector (16 bytes)
    const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
        iv: iv.toString('hex'), // Store IV as a hex string
        encryptedData: encrypted // Store encrypted text as a hex string
    };
}

// Decryption function
export function decrypt(encryptedObj: { iv: string; encryptedData: string }): string {
    const iv = Buffer.from(encryptedObj.iv, 'hex'); // Convert IV back to Buffer
    const encryptedText = Buffer.from(encryptedObj.encryptedData, 'hex'); // Convert encrypted data back to Buffer
    const decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    
    const decryptedBuffers = [decipher.update(encryptedText), decipher.final()];
    const decrypted = Buffer.concat(decryptedBuffers).toString('utf8');
    
    return decrypted;  // Return decrypted text in utf-8 format
}