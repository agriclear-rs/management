const router = require("express").Router();
const UserController = require("./user.controller");
const Controller = require("./my.controller");
const { Secure } = require("../../helpers/utils/secure");
const { PM, ERR } = require("../../helpers");

router.use(Secure(), (req, res, next) => {
  this.my = new Controller({ curUser: req.curUser });
  next();
});

router.get("/", (req, res, next) => {
  UserController.getById(req.tokenData.user_id)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.post("/organization", (req, res, next) => {
  if (!req.body.organization) throw Error("Must send valid organization");
  this.my
    .setOrganization(req.body.organization)
    .then(u => res.json(u))
    .catch(e => next(e));
});

module.exports = router;
