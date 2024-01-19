import MONGOOSE from "mongoose";

const SUCCESS_SCHEMA = new MONGOOSE.Schema({
  publish_date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    default: null,
  },
});

module.exports = MONGOOSE.model("Story", SUCCESS_SCHEMA);
