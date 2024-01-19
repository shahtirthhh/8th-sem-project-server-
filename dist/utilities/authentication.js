"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.generate_token = (user) => {
    const token = jsonwebtoken_1.default.sign({
        email: user.email,
        _id: user._id.toString(),
    }, process.env.TOKEN_GENERATION_SECRET_KEY, { expiresIn: "1h" });
    return token;
};
exports.password_matcher = (plaintext, hashedValue) => {
    return bcrypt_1.default.compareSync(plaintext, hashedValue);
    //   Plaintext entered by the user, encrypted string  stored in the database
};
