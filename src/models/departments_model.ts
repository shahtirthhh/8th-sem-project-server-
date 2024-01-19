import MONGOOSE from "mongoose";

const DEPARTMENTS_SCHEMA = new MONGOOSE.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = MONGOOSE.model("Department", DEPARTMENTS_SCHEMA);
