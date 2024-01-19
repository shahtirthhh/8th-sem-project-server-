import MONGOOSE from "mongoose";

const CITIZEN_SCHEMA = new MONGOOSE.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  complaints: {
    type: Array,
    default: [],
  },
  reports: {
    type: Array,
    default: [],
  },
  meeting: {
    type: MONGOOSE.Types.ObjectId,
    default: null,
  },
});

module.exports = MONGOOSE.model("Citizen", CITIZEN_SCHEMA);
