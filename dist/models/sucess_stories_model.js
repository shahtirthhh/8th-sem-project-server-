"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SUCCESS_SCHEMA = new mongoose_1.default.Schema({
    publish_date: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: Array,
        default: null,
    },
});
module.exports = mongoose_1.default.model("Story", SUCCESS_SCHEMA);
