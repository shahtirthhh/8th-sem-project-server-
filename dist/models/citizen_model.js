"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CITIZEN_SCHEMA = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    complaints: {
        type: Array,
        default: [],
    },
    reports: {
        type: Array,
        default: [],
    },
    meetings: {
        type: Array,
        default: [],
    },
    meeting: {
        type: mongoose_1.default.Types.ObjectId,
        default: null,
    },
});
module.exports = mongoose_1.default.model("Citizen", CITIZEN_SCHEMA);
