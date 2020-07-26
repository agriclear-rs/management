const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/", SecureUI(), (req, res, next) => {
  res.render("farmer/index", {
    title: "Farmer List"
  });
});

router.get("/:id", SecureUI(), (req, res, next) => {
  res.render("farmer/details", {
    title: "Farmer Details",
    data: {
      farmerId: req.params.id
    }
  });
});

module.exports = router;
