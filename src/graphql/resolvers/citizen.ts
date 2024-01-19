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
      const { _doc } = await CITIZEN_MODEL.findOne({ email: req.email });
      if (!_doc.meeting) {
        var index = 0;
        _doc.meetings.forEach(async (meetingId: any) => {
          const meeting = await MEETINGS_MODEL.findOne({ _id: meetingId });
          // console.log(meeting);
          _doc.meetings[index] = meeting;
          index++;
        });
        return { meeting: null, meetings: _doc.meetings };
      } else {
        const meeting = await MEETINGS_MODEL.findOne({ _id: _doc.meeting });

        const meetingsPromises = _doc.meetings.map(async (meetingId: any) => {
          const meeting = await MEETINGS_MODEL.findOne({ _id: meetingId });
          return meeting;
        });

        const fetched_meetings = await Promise.all(meetingsPromises);
        return { meeting: meeting._doc, meetings: fetched_meetings };
      }
    }
  },
  getFreeSlots: async (args: any, req: AuthenticationRequest) => {
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
    console.log(dates);
    return dates;
    // if (!req.isAuth) {
    //   throw new Error("Authentication Error");
    // } else {
    //   var free_dates = [];
    //   for (let index = 0; index < 4; index++) {

    //   }

    // }
  },
};
