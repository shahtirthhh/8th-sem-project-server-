"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SLOTS_SCHEMA = new mongoose_1.default.Schema({
    district: {
        type: String,
        default: "Rajkot",
    },
    slot1: {
        type: String,
        required: true,
    },
    slot2: {
        type: String,
        required: true,
    },
});
module.exports = mongoose_1.default.model("Slot", SLOTS_SCHEMA);
