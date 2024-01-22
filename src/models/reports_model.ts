import MONGOOSE from "mongoose";

const REPORTS_SCHEMA = new MONGOOSE.Schema({
  date_of_submit: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  from: {
    type: String,
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

module.exports = MONGOOSE.model("Report", REPORTS_SCHEMA);
