const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const SeedSchema = mongoose.Schema(
  {
    batch_no: { type: String, required: true, unique: true },
    uuid: { type: String, required: true },
    farms: [{ type: ObjectId, ref: 'Farms' }],
    distributors: [{ type: ObjectId, ref: 'Distributors' }],
    farmers: [{ type: ObjectId, ref: 'Farmers' }],
    tasks: [{
      date: String, task: String, status: { type: Boolean, default: false },
    }],
    crop: { type: ObjectId, ref: 'Knowledge' },
    name: { type: String, required: true },
    crop_variety: { type: String },
    plots: [{ type: String }],
    image_url: { type: String },
    is_modified: { type: Boolean },
    has_quality_assurance: { type: Boolean },
    assurance_doc_url: [{ type: String }],
    days_for_seedling: { type: String },
    days_for_harvesting: { type: String },
    comment: { type: String },
    additives_used: { type: Boolean },
    additive_image_url: [{ type: String }],
    seedling_yourself: { type: Boolean },
    seedling_image_url: [{ type: String }],
    seedling_purchase_receipt_url: [{ type: String }],
    seedling_transplanted: { type: Boolean },
    seedling_transplant_image_url: [{ type: String }],
    fertilizer_added: { type: Boolean },
    fertilizer_image_url: [{ type: String }],
    is_plant_infected: { type: Boolean },
    pesticide_added: { type: Boolean },
    pesticide_image_url: [{ type: String }],
    plant_image_url: [{ type: String }],
    untreated_human_sewage: { type: Boolean },
    water_tested: { type: Boolean },
    sewage_water_used: { type: Boolean },
    is_harvested: { type: Boolean },
    harvested_image_url: [{ type: String }],
    is_contaminated: { type: Boolean },
    is_contaminated_isolated: { type: Boolean },
    product_collected: { type: Boolean },
    chemicals_or_waxes_used: { type: Boolean },
    product_washed: { type: Boolean },
    sewage_water_post_harvest_used: { type: Boolean },
    is_product_contaminated: { type: Boolean },
    is_product_contaminated_isolated: { type: Boolean },
    is_product_packaged: { type: Boolean },
  },
  {
    collection: 'seeds',
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  },
);

module.exports = mongoose.model('Seeds', SeedSchema);
