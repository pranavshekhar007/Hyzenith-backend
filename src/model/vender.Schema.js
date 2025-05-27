const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const { type } = require("os");

const venderSchema = mongoose.Schema({
  profilePic: {
    type: String,
  },
  firstName: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
  },
  pincode: {
    type: String,
  },
});

venderSchema.plugin(timestamps);
module.exports = mongoose.model("Vendor", venderSchema);
