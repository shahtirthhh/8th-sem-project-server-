import MONGOOSE from "mongoose";

const NOTICE_SCHEMA = new MONGOOSE.Schema({
  announcement_date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = MONGOOSE.model("Notice", NOTICE_SCHEMA);
