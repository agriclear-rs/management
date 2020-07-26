const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { ERR } = require('../../helpers');
const Model = require('./farm.model');

const { ObjectId } = mongoose.Types;
const SeedController = require('../seed/seed.controller');

class FarmController {
  add(payload) {
    return Model.create(payload);
  }

  remove(id) {
    return Model.findByIdAndDelete(id);
  }

  async update(id, payload) {
    if (payload.seed_id) {
      await SeedController.updateSeedInfo(id, payload.seed_id);
    }
    return await Model.findByIdAndUpdate(id, payload);
  }

  list({
    start, limit, farmId, farmerId, distributorId, farm, farm_id, owner,
  }) {
    const query = [];
    query.push(
      {
        $lookup: {
          from: 'knowledge',
          localField: 'crops',
          foreignField: '_id',
          as: 'crops',
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
      {
        $lookup: {
          from: 'farmers',
          localField: 'farmers',
          foreignField: '_id',
          as: 'farmers',
        },
      },
    );
    if (owner) {
      query.push({
        $match: {
          owner: {
            $regex: new RegExp(owner, 'gi'),
          },
        },
      });
    }
    if (farm_id) {
      query.push({
        $match: {
          farm_id: {
            $regex: new RegExp(farm_id, 'gi'),
          },
        },
      });
    }
    if (farm) {
      query.push({
        $match: {
          name: {
            $regex: new RegExp(farm, 'gi'),
          },
        },
      });
    }
    if (farmId) {
      query.push({
        $match: {
          _id: ObjectId(farmId),
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

  getFarmerInfo(seedId) {
    return Model.aggregate([
      {
        $match: {
          seeds: {
            $in: [new ObjectId(seedId)],
          },
        },
      },
      {
        $lookup: {
          from: 'farmers',
          localField: 'farmers',
          foreignField: '_id',
          as: 'caretaker',
        },
      },
      {
        $lookup: {
          from: 'distributors',
          localField: 'distributors',
          foreignField: '_id',
          as: 'distributor',
        },
      },
      {
        $unwind: {
          path: '$caretaker',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$distributor',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          address: 1,
          name: 1,
          caretaker_name: '$caretaker.name',
          caretaker_image: '$caretaker.image_url',
          distributor_name: '$distributor.name',
          distributor_image: '$distributor.image_url',
        },
      },
    ]);
  }

  assignFarmer(farmId, farmerId) {
    return Model.findByIdAndUpdate(farmId, { $push: { farmers: ObjectId(farmerId) } });
  }

  assignDistributor(farmId, distributorId) {
    return Model.findByIdAndUpdate(farmId, { $push: { distributors: ObjectId(distributorId) } });
  }

  async removeFarmer(id, farmerId) {
    return await Model.findByIdAndUpdate(id, { $pull: { farmers: farmerId } });
  }

  async removeDistributor(id, distributorId) {
    return await Model.findByIdAndUpdate(id, { $pull: { distributors: distributorId } });
  }
}

module.exports = new FarmController();
