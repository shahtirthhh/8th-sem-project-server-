import MONGOOSE from "mongoose";

const COLLECTOR_SCHEMA = new MONGOOSE.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  socket: {
    type: String,
    default: null,
  },
});

module.exports = MONGOOSE.model("Collector", COLLECTOR_SCHEMA);
