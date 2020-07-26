const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const FarmSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    farm_id: { type: String },
    farmers: [{ type: ObjectId, ref: 'Farmers' }],
    distributors: [{ type: ObjectId, ref: 'Distributors' }],
    owner: { type: String },
    address: { type: String },
    contact_no: { type: String },
    email: { type: String },
    website: { type: String },
    crops: [{ type: ObjectId, ref: 'Knowledge' }],
    gps: {
      longitude: { type: String },
      latitude: { type: String },
    },
    land_area: { type: String },
    climate_zone: { type: String },
    soil_type: { type: String },
    irrigation_sources: { type: String },
    no_of_plot: { type: String },
    elevation: { type: String },
    any_land_risk: { type: Boolean },
    any_monitoring_program: { type: Boolean },
    land_risk_doc: { type: String },
    monitoring_doc: { type: String },
  },
  {
    collection: 'farms',
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  },
);

module.exports = mongoose.model('Farms', FarmSchema);
