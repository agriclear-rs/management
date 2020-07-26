const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const CommentSchema = mongoose.Schema(
  {
    seed: { type: ObjectId, required: true, ref: "Seeds" },
    question: { type: String },
    comment: { type: String },
    userType: { type: String, required: true, enum: ["admin", "farmer", "distributor"] },
    is_new: { type: Boolean, required: true, default: true }
  },
  {
    collection: "comments",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model("Comments", CommentSchema);
