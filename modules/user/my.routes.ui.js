const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/profile", SecureUI(), (req, res, next) => {
  res.render("user/me", { title: "My Profile" });
});

module.exports = router;
