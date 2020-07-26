const { DataUtils } = require("../../helpers/utils");
const { ERR } = require("../../helpers");
const UserModel = require("./user.model");

const config = require("config");

class Controller {
  constructor(cfg) {
    Object.assign(this, cfg);
  }
}

module.exports = Controller;
