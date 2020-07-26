const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/", SecureUI(), (req, res, next) => {
  res.render("farm/index", {
    title: "Farm List"
  });
});

router.get("/add", SecureUI(), (req, res, next) => {
  res.render("farm/add", {
    title: "Add Farm"
  });
});

router.get("/:id", SecureUI(), (req, res, next) => {
  res.render("farm/details", {
    title: "Farm Details",
    data: {
      farmId: req.params.id
    }
  });
});

module.exports = router;
