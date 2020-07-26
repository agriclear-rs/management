const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/", SecureUI(), (req, res, next) => {
  res.render("knowledge/index", {
    title: "Crop Knowledge Base"
  });
});

router.get("/:id", SecureUI(), (req, res, next) => {
  res.render("knowledge/details", {
    title: "Crop Details",
    data: {
      knowledgeId: req.params.id
    }
  });
});

module.exports = router;
