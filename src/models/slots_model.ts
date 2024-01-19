import MONGOOSE from "mongoose";

const SLOTS_SCHEMA = new MONGOOSE.Schema({
  district: {
    type: String,
    default: "Rajkot",
  },
  slot1: {
    type: String,
    required: true,
  },
  slot2: {
    type: String,
    required: true,
  },
});

module.exports = MONGOOSE.model("Slot", SLOTS_SCHEMA);
