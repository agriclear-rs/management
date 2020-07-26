const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const config = require("config");
const { UserManager } = require("rs-user");
const { UserModel, UserAuthModel } = require("./user.model");

const { DataUtils } = require("../../helpers/utils");
const { ERR } = require("../../helpers");

const messenger = require("../../helpers/utils/messenger");
const RoleController = require("../role/role.controller");

const createTokenData = async user => {
  let permissions = await RoleController.calculatePermissions(user.roles);
  return {
    permissions
  };
};

class UserController extends UserManager {
  find(query) {
    return this.models.User.find(query);
  }

  login({ username, password, rememberMe = false }) {
    let check = username.includes("@");
    let method;
    if (check) {
      method = "email";
    } else {
      method = "phone";
    }
    return this.authenticate({
      username,
      password,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration"),
      loginBy: method
    });
  }

  async loginExternal({ service, service_id, extras }) {
    let validEmail = /(rumsan.com|rumsan.net)/g.test(extras.email);
    if (validEmail) extras.roles = ["Admin"];
    // if (!exists) throw Error("Please contact Rumsan adminstrator for access.");
    return this.authenticateExternal({
      service,
      service_id,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration"),
      extras,
      options: { registerNewUser: true }
    });
  }

  async addRoles({ user_id, roles }) {
    let isValid = await RoleController.isValidRole(roles);
    if (!isValid) throw ERR.ROLES_NOEXISTS;
    return super.addRoles({ user_id, roles });
  }

  list({ start, limit }) {
    let query = [];
    query.push(
      {
        $match: {
          is_active: true
        }
      },
      {
        $lookup: {
          from: "users_comm",
          localField: "comms",
          foreignField: "_id",
          as: "comms"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          full_name: { $concat: ["$name.first", " ", "$name.last"] },
          comms: {
            $filter: {
              input: "$comms",
              as: "item",
              cond: {
                $eq: ["$$item.is_primary", true]
              }
            }
          },
          is_active: 1,
          created_at: 1,
          updated_at: 1
        }
      }
    );
    return DataUtils.paging({
      start,
      limit,
      sort: { "name.first": 1 },
      model: this.models.UserModel,
      query
    });
  }
}

module.exports = new UserController({
  mongoose,
  messenger,
  appSecret: config.get("app.secret"),
  jwtDuration: config.get("jwt.duration"),
  modelConfig: {
    User: {
      schema: {
        type: { type: String },
        farmer_id: { type: ObjectId },
        distributor_id: { type: ObjectId }
      }
    }
  }
});
