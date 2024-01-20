"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.hash_string = (plaintext) => {
    return bcrypt_1.default.hashSync(plaintext, parseInt(process.env.BCRYPT_NUMBER_OF_ROUNDS));
};
