import MONGOOSE from "mongoose";

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
const { send_mail } = require("../../utilities/mailer");
const { hash_string } = require("../../utilities/hasher");
const {
  encrypt_string,
  decrypt_string,
} = require("../../utilities/cryptic-ops");
const {
  password_matcher,
  generate_token,
} = require("../../utilities/authentication");
interface AuthenticationRequest extends Request {
  isAuth?: boolean;
  email?: string; // Assuming you want to add email to the request
}

const OTP_GENERATOR = () => {
  let otp;
  do {
    otp = Math.floor(1000 + Math.random() * 9000).toString();
  } while (otp.length != 4);
  return otp;
};
function getDatesFromTomorrowToFourDaysAfter() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 2);

  const fourDaysAfter = new Date(today);
  fourDaysAfter.setDate(today.getDate() + 5);

  const dates = [];

  while (tomorrow <= fourDaysAfter) {
    dates.push(new Date(tomorrow).toDateString());
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  return dates;
}
const free_slot_checker = (meetings: any, date: string, slot: string) => {
  return meetings.find((meeting: any) => {
    return meeting.date === date && meeting.slot === slot;
  });
};
exports.citizenResolvers = {
  sendOtp: async (args: { email: string }) => {
    if (!isEmail.test(args.email)) {
      throw new Error("Incorrect Email !");
    } else {
      const citizen = await CITIZEN_MODEL.findOne({ email: args.email });
      if (citizen) {
        throw new Error("Email already registered, Please Login !");
      } else {
        const OTP = OTP_GENERATOR();
        console.log(OTP);
        //   send_mail(
        //     args.email,
        //     `Email verification for Resolution and Readdresal portal of Rajkot","One Time Password is ${OTP}`,
        //     "Please do not share this OTP for valid security reasons."
        //   );
        const ENC = encrypt_string(OTP);
        return ENC;
      }
    }
  },
  verifyOtp: (args: { otp: string; enc: string }): boolean => {
    const { otp, enc } = args;
    if (otp === decrypt_string(enc)) {
      return true;
    } else {
      return false;
    }
  },
  register: async (args: { email: string; password: string }) => {
    const citizen = await CITIZEN_MODEL.findOne({ email: args.email });
    if (citizen) {
      throw new Error("Email already registered, Please Login !");
    } else {
      const hashed = await hash_string(args.password);
      const account = new CITIZEN_MODEL({ ...args, password: hashed });
      await account.save();
      return true;
    }
  },
  loginCitizen: async (args: { email: string; password: string }) => {
    const { email, password } = args;
    if (!isEmail.test(email) || !isPassword.test(password)) {
      throw new Error("Incorrect Details !");
    }
    const citizen = await CITIZEN_MODEL.findOne({ email });
    if (citizen) {
      if (password_matcher(password, citizen.password)) {
        const token = generate_token({ email, _id: citizen._id });
        var return_obj = { ...citizen._doc, token };
        delete return_obj.password;
        return return_obj;
      } else {
        throw new Error("Incorrect Credentials !");
      }
    } else {
      throw new Error("User not found !");
    }
  },
  myMeeting: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const { slots } = await SLOTS_MODEL.findOne({ district: "Rajkot" });
      const _doc = await CITIZEN_MODEL.findOne({ email: req.email });
      if (!_doc.meeting) {
        const meetingsPromises = _doc.meetings.map(async (meetingId: any) => {
          const meeting = await MEETINGS_MODEL.findOne({ _id: meetingId });

          meeting.slot = slots.find(
            (slot: any) => slot.name === meeting.slot
          ).time;
          return meeting;
        });
        _doc.meetings = await Promise.all(meetingsPromises);

        // _doc.meetings.forEach(async (meetingId: any) => {
        //   const meeting = await MEETINGS_MODEL.findOne({ _id: meetingId });
        //   // console.log(meeting);
        //   _doc.meetings[index] = meeting;
        //   index++;
        // });

        // _doc.meetings = await Promise.all(promises);
        return { meeting: null, meetings: _doc.meetings };
      } else {
        const meeting = await MEETINGS_MODEL.findOne({ _id: _doc.meeting });
        meeting.slot = slots.find(
          (slot: any) => slot.name === meeting.slot
        ).time;
        const meetingsPromises = _doc.meetings.map(async (meetingId: any) => {
          const meeting = await MEETINGS_MODEL.findOne({ _id: meetingId });
          meeting.slot = slots.find(
            (slot: any) => slot.name === meeting.slot
          ).time;
          return meeting;
        });

        const fetched_meetings = await Promise.all(meetingsPromises);
        // console.log(fetched_meetings);
        // console.log(meeting);
        meeting._doc.from = req.email;
        return { meeting: meeting._doc, meetings: fetched_meetings };
      }
    }
  },
  getFreeSlots: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth || !req.email) {
      throw new Error("Authentication Error");
    } else {
      const citizen = await CITIZEN_MODEL.findOne({ email: req.email });
      if (!citizen) {
        throw new Error("Bad request !");
      } else if (citizen.meeting) {
        throw new Error("One meeting already requested !");
      } else {
        const dateRange = getDatesFromTomorrowToFourDaysAfter();
        const meetings = await MEETINGS_MODEL.find();
        const slots = await SLOTS_MODEL.findOne({ district: "Rajkot" });
        var dates: any = [];

        dateRange.map((date) => {
          slots.slots.map((slot: string) => {
            if (!free_slot_checker(meetings, date, slot)) {
              dates.push({ date, slot: slot });
            }
          });
        });
        return dates;
      }
    }
  },
  requestMeeting: async (
    args: { date: string; slot: string; overview: string },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth || !req.email) {
      throw new Error("Authentication Error");
    } else {
      const dates = await exports.citizenResolvers.getFreeSlots({}, req);
      const match = dates.find(
        (date: any) => date.date === args.date && date.slot.name === args.slot
      );
      if (!match) {
        throw new Error("Bad Request !");
      } else {
        const citizen = await CITIZEN_MODEL.findOne({ email: req.email });
        if (!citizen || citizen.meeting) {
          throw new Error("Bad Request !");
        }
        const new_meeting = new MEETINGS_MODEL({
          date_of_submit: new Date().toDateString(),
          from: citizen._id,
          date: match.date,
          slot: match.slot.name,
          overview: args.overview,
        });
        const saved = await new_meeting.save();
        await CITIZEN_MODEL.updateOne(
          { email: req.email },
          { $set: { meeting: saved._id } }
        );
        if (saved) {
          return true;
        } else {
          throw new Error("⚠ Something went wrong");
        }
      }
    }
  },
  missedMyMeeting: async (
    args: { meetingId: string },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth || !req.email) {
      throw new Error("Authentication Error");
    } else {
      const citizen = await CITIZEN_MODEL.findOne({ email: req.email });
      if (!citizen || !citizen.meeting) {
        throw new Error("Bad Request !");
      }
      const updated = await MEETINGS_MODEL.findOneAndUpdate(
        { _id: new MONGOOSE.Types.ObjectId(args.meetingId) },
        { $set: { missed: true } },
        { new: true }
      );
      // const saved = await new_meeting.save();
      const modified = await CITIZEN_MODEL.updateOne(
        { email: req.email },
        { $set: { meeting: null }, $push: { meetings: updated._id } },
        { new: true }
      );
      return true;
    }
  },
  getCollectorSocket: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const collector = await COLLECTOR_MODEL.findOne({
        email: "dhabu2212@gmail.com",
      });
      if (collector.socket) {
        return collector.socket;
      }
      return false;
    }
  },
  newComplaint: async (
    args: {
      content: string;
      location: string;
      department: string;
      image: Array<string>;
    },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const complaint = new COMPLAINTS_MODEL({
        date_of_submit: new Date().toDateString(),
        from: req.email,
        department: args.department,
        content: args.content,
        location: args.location,
        image: args.image,
      });
      const saved = await complaint.save();
      await CITIZEN_MODEL.findOneAndUpdate(
        { email: req.email },
        { $push: { complaints: saved._id } }
      );
      return saved.toString();
    }
  },
  myComplaints: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const complaints = await COMPLAINTS_MODEL.find({ from: req.email });
      return complaints;
    }
  },
  newReport: async (
    args: {
      content: string;
      location: string;

      image: Array<string>;
    },
    req: AuthenticationRequest
  ) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const complaint = new REPORTS_MODEL({
        date_of_submit: new Date().toDateString(),
        from: req.email,

        content: args.content,
        location: args.location,
        image: args.image,
      });
      const saved = await complaint.save();
      await CITIZEN_MODEL.findOneAndUpdate(
        { email: req.email },
        { $push: { reports: saved._id } }
      );
      return saved.toString();
    }
  },
  myReports: async (args: any, req: AuthenticationRequest) => {
    if (!req.isAuth) {
      throw new Error("Authentication Error");
    } else {
      const complaints = await REPORTS_MODEL.find({ from: req.email });
      return complaints;
    }
  },
};
