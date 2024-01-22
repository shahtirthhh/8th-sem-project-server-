"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const COLLECTOR_MODEL = require("../../models/collector_login_model");
const MEETINGS_MODEL = require("../../models/meetings_model");
const NOTES_MODEL = require("../../models/notes_model");
const COMPLAINTS_MODEL = require("../../models/complaints_model");
const REPORTS_MODEL = require("../../models/reports_model");
const NOTICES_MODEL = require("../../models/notice_board_model");
const STORIES_MODEL = require("../../models/sucess_stories_model");
const SLOTS_MODEL = require("../../models/slots_model");
const CITIZEN_MODEL = require("../../models/citizen_model");
const { isEmail, isPassword } = require("../../helpers/validator");
const { password_matcher, generate_token, } = require("../../utilities/authentication");
exports.collectorResolvers = {
    login: async (args) => {
        const { email, password } = args;
        if (!isEmail.test(email) || !isPassword.test(password)) {
            return { valid: false, token: null };
        }
        const collector = await COLLECTOR_MODEL.findOne({ email });
        if (collector) {
            if (password_matcher(password, collector.password)) {
                const token = generate_token({ email, _id: collector._id });
                return { valid: true, token };
            }
            else {
                return { valid: false, token: null };
            }
        }
        return { valid: false, token: null };
    },
    meetings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const meetings = await MEETINGS_MODEL.find().populate("from");
            const { slots } = await SLOTS_MODEL.findOne({ district: "Rajkot" });
            meetings.map(async (meeting) => {
                meeting.slot = slots.find((slot) => slot.name === meeting.slot).time;
            });
            // // console.log(meetings);
            return meetings;
        }
    },
    notes: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const notes = await NOTES_MODEL.find();
            return notes;
        }
    },
    complaints: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const complaints = await COMPLAINTS_MODEL.find();
            return complaints;
        }
    },
    reports: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const reports = await REPORTS_MODEL.find();
            return reports;
        }
    },
    notices: async (args) => {
        const notices = await NOTICES_MODEL.find();
        return notices;
    },
    stories: async (args) => {
        const stories = await STORIES_MODEL.find();
        return stories;
    },
    citizens: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const citizens = await CITIZEN_MODEL.find();
            citizens.map((citizen) => delete citizen.password);
            return citizens;
        }
    },
    // -------------------------------x Mutations x------------------------------------
    saveNote: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const new_note = NOTES_MODEL(args.note);
            const saved_note = await new_note.save();
            return saved_note;
        }
    },
    deleteNote: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const deleted_note = await NOTES_MODEL.deleteOne({
                _id: new mongoose_1.default.Types.ObjectId(args.id),
            });
            return deleted_note;
        }
    },
    publishNotice: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const new_notice = NOTICES_MODEL({
                content: args.content,
                announcement_date: new Date().toLocaleString(),
            });
            const saved_notice = await new_notice.save();
            return saved_notice;
        }
    },
    publishStory: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const new_story = STORIES_MODEL({
                ...args.story,
                publish_date: new Date().toLocaleString(),
            });
            const saved_story = await new_story.save();
            return saved_story;
        }
    },
    cancelMeeting: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const modified = await MEETINGS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.id) }, {
                $set: { cancel: true, reason_to_cancel: args.reason_to_cancel },
            }, { new: true });
            // console.log(modified);
            const updated = await CITIZEN_MODEL.findOneAndUpdate({ _id: modified.from }, { $set: { meeting: null }, $push: { meetings: modified._id } }, { new: true });
            // console.log(updated);
            return true;
        }
    },
    confirmMeeting: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const modified = await MEETINGS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.id) }, {
                $set: { confirm: true },
            }, { new: true });
            return true;
        }
    },
    setNotificationsAsSeen: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            if (args.meetings.length >= 1) {
                const updatePromises = args.meetings.map(async (meeting) => {
                    const updated = await MEETINGS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(meeting._id) }, { $set: { seen: true } }, { new: true });
                    return updated;
                });
                Promise.all(updatePromises);
            }
            if (args.complaints.length >= 1) {
                const updatePromises = args.complaints.map(async (complaint) => {
                    const updated = await COMPLAINTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(complaint._id) }, { $set: { seen: true } }, { new: true });
                    return updated;
                });
                Promise.all(updatePromises);
            }
            if (args.reports.length >= 1) {
                const updatePromises = args.reports.map(async (report) => {
                    const updated = await REPORTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(report._id) }, { $set: { seen: true } }, { new: true });
                    return updated;
                });
                Promise.all(updatePromises);
            }
            return true;
        }
    },
    changeStatus: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const collector = await COLLECTOR_MODEL.findOne({ email: req.email });
            if (!collector) {
                throw new Error("Bad request !");
            }
            if (args.status && collector) {
                await COLLECTOR_MODEL.findOneAndUpdate({ email: req.email }, { $set: { socket: args.socket } });
                return true;
            }
            else {
                await COLLECTOR_MODEL.findOneAndUpdate({ email: req.email }, { $set: { socket: null } });
                return false;
            }
        }
    },
    setMeetingAsHappened: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const updated = await MEETINGS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.meetingId) }, { $set: { happen: true } }, { new: true });
            if (!updated) {
                throw new Error("Bad request !");
            }
            else {
                return true;
            }
        }
    },
    setAsUnderReview: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const updated = await COMPLAINTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.complaintId) }, { $set: { under_review: true } }, { new: true });
            if (!updated) {
                throw new Error("Bad request !");
            }
            else {
                return true;
            }
        }
    },
    setAsProcessed: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const updated = await COMPLAINTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.complaintId) }, { $set: { under_review: false, processed: true } }, { new: true });
            if (!updated) {
                throw new Error("Bad request !");
            }
            else {
                return true;
            }
        }
    },
    setAsUnderReviewReport: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const updated = await REPORTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.reportId) }, { $set: { under_review: true } }, { new: true });
            if (!updated) {
                throw new Error("Bad request !");
            }
            else {
                return true;
            }
        }
    },
    setAsProcessedReport: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("Authentication Error");
        }
        else {
            const updated = await REPORTS_MODEL.findOneAndUpdate({ _id: new mongoose_1.default.Types.ObjectId(args.reportId) }, { $set: { under_review: false, processed: true } }, { new: true });
            if (!updated) {
                throw new Error("Bad request !");
            }
            else {
                return true;
            }
        }
    },
};
