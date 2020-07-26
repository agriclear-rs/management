const { DataUtils } = require("../../helpers/utils");
const { ERR } = require("../../helpers");
const Model = require("./comment.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class CommentController {
  add(payload) {
    return Model.create(payload);
  }

  list({ start, limit, seed }) {
    let query = [];
    if (seed) {
      query.push({
        $match: {
          seed: ObjectId(seed)
        }
      });
    }
    return DataUtils.paging({
      start,
      limit,
      sort: { created_at: 1 },
      model: Model,
      query
    });
  }

  getById(id) {
    return Model.findById(id);
  }

  updateStatus(id) {
    return Model.findByIdAndUpdate(id, { is_new: false });
  }
}

module.exports = new CommentController();
