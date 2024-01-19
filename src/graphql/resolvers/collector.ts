import MONGOOSE from "mongoose";

const COLLECTOR_MODEL = require("../../models/collector_login_model");
const MEETINGS_MODEL = require("../../models/meetings_model");
const NOTES_MODEL = require("../../models/notes_model");
const COMPLAINTS_MODEL = require("../../models/complaints_model");
const REPORTS_MODEL = require("../../models/reports_model");
const NOTICES_MODEL = require("../../models/notice_board_model");
const STORIES_MODEL = require("../../models/sucess_stories_model");

const { isEmail, isPassword } = require("../../helpers/validator");
const {
  password_matcher,
  generate_token,
} = require("../../utilities/authentication");
interface AuthenticationRequest extends Request {
  isAuth?: boolean;
  email?: string; // Assuming you want to add email to the request
}
exports.collectorResolvers = {
  login: async (args: {
    email: string;
    password: string;
  }): Promise<{ valid: Boolean; token: String | null }> => {
    const { email, password } = args;
    if (!isEmail.test(email) || !isPassword.test(password)) {
      return { valid: false, token: null };
    }
    const collector = await COLLECTOR_MODEL.findOne({ email });
    if (collector) {
      if (password_matcher(password, collector.password)) {
        const token = generate_token({ email, _id: collector._id });
        return { valid: true, token };
      } else {
        return { valid: false, token: null };
      }
    }
    return { valid: false, token: null };
  },
  meetings: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const meetings = await MEETINGS_MODEL.find();
      return meetings;
    }
  },
  notes: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const notes = await NOTES_MODEL.find();
      return notes;
    }
  },
  complaints: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const complaints = await COMPLAINTS_MODEL.find();
      return complaints;
    }
  },
  reports: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const reports = await REPORTS_MODEL.find();
      return reports;
    }
  },
  notices: async (args: any) => {
    const notices = await NOTICES_MODEL.find();
    return notices;
  },
  stories: async (args: any) => {
    const stories = await STORIES_MODEL.find();

    return stories;
  },
  // -------------------------------x Mutations x------------------------------------
  saveNote: async (
    args: { note: { content: string } },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const new_note = NOTES_MODEL(args.note);
      const saved_note = await new_note.save();
      return saved_note;
    }
  },
  deleteNote: async (args: { id: string }, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const deleted_note = await NOTES_MODEL.deleteOne({
        _id: new MONGOOSE.Types.ObjectId(args.id),
      });
      return deleted_note;
    }
  },
  publishNotice: async (
    args: { content: string },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const new_notice = NOTICES_MODEL({
        content: args.content,
        announcement_date: new Date().toLocaleString(),
      });
      const saved_notice = await new_notice.save();
      return saved_notice;
    }
  },
  publishStory: async (
    args: { story: { content: string; image: Array<String> | null } },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const new_story = STORIES_MODEL({
        ...args.story,
        publish_date: new Date().toLocaleString(),
      });
      const saved_story = await new_story.save();
      return saved_story;
    }
  },
};
