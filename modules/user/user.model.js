const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    name: {
      first: { type: String, required: true },
      initials: String,
      last: String,
      salutation: String,
      suffix: String
    },
    is_active: { type: Boolean, required: true, default: true },
    created_by: { type: ObjectId, ref: "User" },
    updated_by: { type: ObjectId, ref: "User" }
  },
  {
    collection: "users",
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model("TUser", UserSchema);
