const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const FarmerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    farms: [{ type: ObjectId, ref: "Farms" }],
    email: { type: String },
    image_url: { type: String },
    website: { type: String },
    address: { type: String }
  },
  {
    collection: "farmers",
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model("Farmers", FarmerSchema);
