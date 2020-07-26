const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const DistributorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    farms: [{ type: ObjectId, ref: 'Farms' }],
    email: { type: String },
    image_url: { type: String },
    website: { type: String },
    address: { type: String },
    distributor_type: { type: String, enum: ['Wholesaler', 'Retailer'] },
  },
  {
    collection: 'distributors',
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  },
);

module.exports = mongoose.model('Distributors', DistributorSchema);
