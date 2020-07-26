const mongoose = require('mongoose');

const KnowledgeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image_url: { type: String },
    variety: [{ type: String, required: true }],
    cultiver: { type: String },
    origin: { type: String, required: true },
    yield: { type: String },
    maturity: { type: String },
    period: { type: String },
    recommended_domains: [{ type: String }],
    harvesting_cycle: { type: String, enum: ['single', 'multiple'] },
    no_of_harvesting: { type: String },
    days_for_seedling: { type: String },
  },
  {
    collection: 'knowledge',
    toObject: {
      virtuals: true,
    },
    toJson: {
      virtuals: true,
    },
  },
);

module.exports = mongoose.model('Knowledge', KnowledgeSchema);
