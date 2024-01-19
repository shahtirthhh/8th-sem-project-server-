"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MEETINGS_SCHEMA = new mongoose_1.default.Schema({
    happen: {
        type: Boolean,
        default: false,
    },
    reason_to_not_happen: {
        type: String,
        default: "",
    },
    date_of_submit: {
        type: String,
        required: true,
    },
    seen: {
        type: Boolean,
        default: false,
    },
    from: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    slot: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
    cancel: {
        type: Boolean,
        default: false,
    },
    reason_to_cancel: {
        type: String,
        default: null,
    },
});
module.exports = mongoose_1.default.model("Meeting", MEETINGS_SCHEMA);
