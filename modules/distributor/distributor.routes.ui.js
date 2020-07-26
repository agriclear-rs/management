const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/", SecureUI(), (req, res, next) => {
  res.render("distributor/index", {
    title: "Distributor List"
  });
});

router.get("/:id", SecureUI(), (req, res, next) => {
  res.render("distributor/details", {
    title: "Distributor Details",
    data: {
      distributorId: req.params.id
    }
  });
});

module.exports = router;
