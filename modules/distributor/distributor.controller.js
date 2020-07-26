const mongoose = require('mongoose');
const { DataUtils } = require('../../helpers/utils');
const { ERR } = require('../../helpers');
const Model = require('./distributor.model');

const { ObjectId } = mongoose.Types;
const UserController = require('../user/user.controller');
const FarmController = require('../farm/farm.controller');

class DistributorController {
  async add(payload) {
    const distributorPayload = { ...payload };
    const userpayload = payload;
    delete userpayload.email;
    delete userpayload.address;
    delete userpayload.website;
    delete userpayload.image_url;
    userpayload.roles = ['Distributor'];
    const distributor = await Model.create(distributorPayload);
    userpayload.distributor_id = distributor._id;
    // const farm = await FarmController.assignDistributor(payload.farms[0], distributor._id);
    const user = await UserController.createUsingPhone(userpayload);
    return { user, distributor };
  }

  remove(id) {
    return Model.findByIdAndDelete(id);
  }

  update(id, payload) {
    return Model.findByIdAndUpdate(id, payload);
  }

  list({
    start, limit, distributor, farmId,
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
    if (distributor) {
      query.push({
        $match: {
          name: {
            $regex: new RegExp(distributor, 'gi'),
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

module.exports = new DistributorController();
