const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { ERR } = require('../../helpers');
const Model = require('./farmer.model');

const { ObjectId } = mongoose.Types;
const UserController = require('../user/user.controller');
const FarmController = require('../farm/farm.controller');

class FarmerController {
  async add(payload) {
    const farmerpayload = { ...payload };
    const userpayload = payload;
    delete userpayload.email;
    delete userpayload.address;
    delete userpayload.website;
    delete userpayload.image_url;
    userpayload.roles = ['Farmer'];
    const farmer = await Model.create(farmerpayload);
    userpayload.farmer_id = farmer._id;
    // let farm = await FarmController.assignFarmer(payload.farms[0], farmer._id);
    const user = await UserController.createUsingPhone(userpayload);
    return { user, farmer };
  }

  remove(id) {
    return Model.findByIdAndDelete(id);
  }

  update(id, payload) {
    return Model.findByIdAndUpdate(id, payload);
  }

  list({
    start, limit, farmer, farmId,
  }) {
    const query = [];
    query.push({
      $lookup: {
        from: 'farms',
        localField: 'farms',
        foreignField: '_id',
        as: 'farms',
      },
    });
    if (farmer) {
      query.push({
        $match: {
          name: {
            $regex: new RegExp(farmer, 'gi'),
          },
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

module.exports = new FarmerController();
