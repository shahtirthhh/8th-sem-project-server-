import MONGOOSE from "mongoose";

const MEETINGS_SCHEMA = new MONGOOSE.Schema({
  date_of_submit: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  from: {
    type: MONGOOSE.Types.ObjectId,
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

module.exports = MONGOOSE.model("Meeting", MEETINGS_SCHEMA);
