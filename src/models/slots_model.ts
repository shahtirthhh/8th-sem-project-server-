import MONGOOSE from "mongoose";

const SLOTS_SCHEMA = new MONGOOSE.Schema({
  district: {
    type: String,
    default: "Rajkot",
  },
  slots: {
    type: Array,
    required: true,
  },
});

module.exports = MONGOOSE.model("Slot", SLOTS_SCHEMA);
