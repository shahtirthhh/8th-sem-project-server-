import MONGOOSE from "mongoose";

const COMPLAINT_SCHEMA = new MONGOOSE.Schema({
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
  department: {
    type: MONGOOSE.Types.ObjectId,
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
    default: null,
  },
});

module.exports = MONGOOSE.model("Complaint", COMPLAINT_SCHEMA);
