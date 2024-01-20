"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const crypto_1 = __importDefault(require("crypto"));
const ALGORITHM = "aes-256-cbc";
// Encrypt string
exports.encrypt_string = (plaintext) => {
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, process.env.CRYPTO_SECRET_KEY, process.env.CRYPTO_INIT_VECTOR);
    let encrypted = cipher.update(plaintext, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};
// Decrypt string
exports.decrypt_string = (cipher) => {
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, process.env.CRYPTO_SECRET_KEY, process.env.CRYPTO_INIT_VECTOR);
    let decrypted = decipher.update(cipher, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};
