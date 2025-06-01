/* eslint-disable no-undef */
import * as crypto from "crypto"

// Encryption algorithm
const algorithm = "aes-256-cbc";

function getKey(keyString) {
  if (!keyString) {
    throw new Error("Encryption key is missing!");
  }
  const keyBuffer = Buffer.from(keyString, "hex");
  if (keyBuffer.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (64 hex chars) long");
  }
  return keyBuffer;
}


 export function encryptData(data, keyString = process.env.DECODE_ENCODE_SECRET) {
  const key = getKey(keyString);

  const buffer = Buffer.from(data);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const encodedData = Buffer.concat([iv, encryptedData]).toString("base64");

  return encodedData;
}

export function decryptData(encodedData, keyString = process.env.DECODE_ENCODE_SECRET) {
  const key = getKey(keyString);

  const buffer = Buffer.from(encodedData, "base64");
  const iv = buffer.slice(0, 16);
  const encryptedData = buffer.slice(16);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  return decryptedData.toString();
}
