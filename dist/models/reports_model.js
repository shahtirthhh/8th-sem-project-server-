"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const REPORTS_SCHEMA = new mongoose_1.default.Schema({
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
    content: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    under_review: {
        type: Boolean,
        default: false,
    },
    processed: {
        type: Boolean,
        default: false,
    },
    image: {
        type: Array,
    },
});
module.exports = mongoose_1.default.model("Report", REPORTS_SCHEMA);
