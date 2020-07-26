const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { ERR } = require('../../helpers');
const Model = require('./knowledge.model');

const { ObjectId } = mongoose.Types;

class KnowledgeController {
  async add(payload) {
    return Model.create(payload);
  }

  remove(id) {
    return Model.findByIdAndDelete(id);
  }

  update(id, payload) {
    return Model.findByIdAndUpdate(id, payload);
  }

  list({ start, limit, name }) {
    const query = [];
    if (name) {
      query.push({
        $match: {
          name: {
            $regex: new RegExp(name, 'gi'),
          },
        },
      });
    }
    return DataUtils.paging({
      start,
      limit,
      sort: { created_at: 1 },
      model: Model,
      query,
    });
  }

  getById(id) {
    return Model.findById(id);
  }
}

module.exports = new KnowledgeController();
