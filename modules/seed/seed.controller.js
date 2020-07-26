const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { ERR } = require('../../helpers');
const Model = require('./seed.model');

const { ObjectId } = mongoose.Types;
const { v4: uuidv4 } = require('uuid');

class SeedController {
  async add(payload) {
    const lastBatch = await this.getLastEntry();
    if (lastBatch) {
      const batchNum = lastBatch.batch_no;
      let num = parseInt(batchNum.split('-')[1]);
      var nextNum = ++num;
    }
    payload.image_url = payload.image_url
      ? payload.image_url
      : 'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png';
    payload.batch_no = lastBatch ? 'Batch-'.concat(String(nextNum)) : 'Batch-1';
    if (payload.assurance_doc_url) payload.assurance_doc_url = payload.assurance_doc_url.split(',');
    if (payload.additive_image_url) { payload.additive_image_url = payload.additive_image_url.split(','); }
    if (payload.seedling_image_url) { payload.seedling_image_url = payload.seedling_image_url.split(','); }
    if (payload.seedling_purchase_receipt_url) { payload.seedling_purchase_receipt_url = payload.seedling_purchase_receipt_url.split(','); }
    if (payload.seedling_transplant_image_url) { payload.seedling_transplant_image_url = payload.seedling_transplant_image_url.split(','); }
    if (payload.fertilizer_image_url) { payload.fertilizer_image_url = payload.fertilizer_image_url.split(','); }
    if (payload.pesticide_image_url) { payload.pesticide_image_url = payload.pesticide_image_url.split(','); }
    if (payload.plant_image_url) payload.plant_image_url = payload.plant_image_url.split(',');
    if (payload.harvested_image_url) { payload.harvested_image_url = payload.harvested_image_url.split(','); }
    payload.uuid = uuidv4();
    return Model.create(payload);
  }

  remove(id) {
    return Model.findByIdAndDelete(id);
  }

  update(id, payload) {
    payload.assurance_doc_url = payload.assurance_doc_url.split(',');
    payload.additive_image_url = payload.additive_image_url.split(',');
    payload.seedling_image_url = payload.seedling_image_url.split(',');
    payload.seedling_purchase_receipt_url = payload.seedling_purchase_receipt_url.split(',');
    payload.seedling_transplant_image_url = payload.seedling_transplant_image_url.split(',');
    payload.fertilizer_image_url = payload.fertilizer_image_url.split(',');
    payload.pesticide_image_url = payload.pesticide_image_url.split(',');
    payload.plant_image_url = payload.plant_image_url.split(',');
    payload.harvested_image_url = payload.harvested_image_url.split(',');
    return Model.findByIdAndUpdate(id, payload);
  }

  async updateFarmer(id, farmerId) {
    const data = await Model.findById(id);
    if (data.farmers.includes(farmerId)) {
      throw Error('This Farmer is already assigned');
    } else {
      return await Model.findByIdAndUpdate(id, { $push: { farmers: ObjectId(farmerId) } });
    }
  }

  async removeFarmer(id, farmerId) {
    return await Model.findByIdAndUpdate(id, { $pull: { farmers: farmerId } });
  }

  async removeDistributor(id, distributorId) {
    return await Model.findByIdAndUpdate(id, { $pull: { distributors: distributorId } });
  }

  async updateDistributor(id, distributorId) {
    const data = await Model.findById(id);
    if (data.distributors.includes(distributorId)) {
      throw Error('This Distributor is already assigned to this batch crop');
    } else {
      const res = await Model.findByIdAndUpdate(id, {
        $push: { distributors: ObjectId(distributorId) },
      });
      return res;
    }
  }

  list({
    start, limit, seed, seedId, farmId, farmerId, distributorId, batch, crop, variety, farmer, distributor,
  }) {
    const query = [];
    query.push(
      {
        $lookup: {
          from: 'farms',
          localField: 'farms',
          foreignField: '_id',
          as: 'farms',
        },
      },
      {
        $lookup: {
          from: 'farmers',
          localField: 'farmers',
          foreignField: '_id',
          as: 'farmers',
        },
      },
      {
        $lookup: {
          from: 'distributors',
          localField: 'distributors',
          foreignField: '_id',
          as: 'distributors',
        },
      },
    );
    if (seedId) {
      query.push({
        $match: {
          _id: ObjectId(seedId),
        },
      });
    }
    if (farmId) {
      query.push({
        $match: {
          farms: {
            $elemMatch: {
              _id: ObjectId(farmId),
            },
          },
        },
      });
    }
    if (seed) {
      query.push({
        $match: {
          $or: [
            {
              name: {
                $regex: new RegExp(seed, 'gi'),
              },
            },
            {
              batch_no: {
                $regex: new RegExp(seed, 'gi'),
              },
            },
          ],
        },
      });
    }
    if (farmerId) {
      query.push({
        $match: {
          farmers: {
            $elemMatch: {
              _id: ObjectId(farmerId),
            },
          },
        },
      });
    }
    if (farmer) {
      query.push({
        $match: {
          farmers: {
            $elemMatch: {
              _id: ObjectId(farmer),
            },
          },
        },
      });
    }
    if (distributor) {
      query.push({
        $match: {
          distributors: {
            $elemMatch: {
              _id: ObjectId(distributor),
            },
          },
        },
      });
    }
    if (distributorId) {
      query.push({
        $match: {
          distributors: {
            $elemMatch: {
              _id: ObjectId(distributorId),
            },
          },
        },
      });
    }
    if (batch) {
      query.push({
        $match: {
          batch_no: {
            $regex: new RegExp(batch, 'gi'),
          },
        },
      });
    }
    if (crop) {
      query.push({
        $match: {
          name: {
            $regex: new RegExp(crop, 'gi'),
          },
        },
      });
    }
    if (variety) {
      query.push({
        $match: {
          crop_variety: {
            $regex: new RegExp(variety, 'gi'),
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

  updateComment(id, data) {
    return Model.findByIdAndUpdate(id, data);
  }

  getByUuid(id) {
    return Model.findOne({ uuid: id });
  }

  async getLastEntry() {
    return Model.findOne().sort({ _id: -1 }).limit(1);
  }

  async updateSeedInfo(farmId, seedId) {
    const data = await Model.findById(seedId);
    if (!data.farms.includes(farmId)) {
      const res = await Model.findByIdAndUpdate(seedId, { $push: { farms: ObjectId(farmId) } });
      return res;
    }
  }

  addTask(id, task) {
    let date = new Date();
    date = date.toISOString();
    return Model.findByIdAndUpdate(id, { $push: { tasks: { date, task: task.task } } });
  }

  async updateTask(id, payload) {
    const x = await Model.findOneAndUpdate({ _id: id, 'tasks._id': payload.taskId }, { $set: { 'tasks.$.status': payload.status } });
    return x;
  }
}

module.exports = new SeedController();
