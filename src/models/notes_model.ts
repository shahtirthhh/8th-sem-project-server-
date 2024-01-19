import MONGOOSE from "mongoose";

const NOTES_SCHEMA = new MONGOOSE.Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = MONGOOSE.model("Note", NOTES_SCHEMA);
