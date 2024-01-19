import "dotenv/config";
import CRYPTO from "crypto";

const ALGORITHM = "aes-256-cbc";

// Encrypt string
exports.encrypt_string = (plaintext: string): string => {
  const cipher = CRYPTO.createCipheriv(
    ALGORITHM,
    process.env.CRYPTO_SECRET_KEY!,
    process.env.CRYPTO_INIT_VECTOR!
  );
  let encrypted = cipher.update(plaintext, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Decrypt string
exports.decrypt_string = (cipher: string): string => {
  const decipher = CRYPTO.createDecipheriv(
    ALGORITHM,
    process.env.CRYPTO_SECRET_KEY!,
    process.env.CRYPTO_INIT_VECTOR!
  );
  let decrypted = decipher.update(cipher, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};
