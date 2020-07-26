const router = require("express").Router();
const package = require("../../package.json");
const config = require("config");

const { SecureUI } = require("../utils/secure");
const { api_v1, ui } = require("./routes.json");
const SettingController = require("../../modules/setting/setting.controller");

router.use(async (req, res, next) => {
  let commonData = {
    app: { version: package.version.replace(/\./g, "-") }
  };

  res.renderWithData = async (view, data = {}) => {
    let resData = Object.assign(data, commonData);
    res.render(view, resData);
  };
  next();
});

//enables Passport Logins
if (config.has("app.social")) {
  if (config.get("app.social")) {
    require("../utils/passport");
  }
}

//Scan Route
router.get("/", (req, res, next) => {
  res.render("scan", { title: "Scanner" });
});

// Get home page
router.get("/cms", SecureUI(), (req, res, next) => {
  res.renderWithData("index", { title: "Agriclear" });
});

router.get("/settings", SecureUI(), (req, res, next) => {
  res.render("misc/settings", { title: "Settings" });
});

//Unauthorized Page
router.get("/unauthorized", SecureUI(), (req, res, next) => {
  res.render("misc/404", { title: "Page not found" });
});

router.use("/", require("../../modules/user/auth.routes"));

Object.keys(api_v1).forEach(key => {
  router.use(`/api/v1/${key}`, require(api_v1[key]));
});

Object.keys(ui).forEach(key => {
  router.use(`/${key}`, require(ui[key]));
});

module.exports = router;
