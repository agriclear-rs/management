const router = require("express").Router();
const Controller = require("./farmer.controller");
const { SecureAPI } = require("../../helpers/utils/secure");

router.get("/", SecureAPI(), (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  let search = req.query.search || null;
  if (req.query.name) var farmer = req.query.name;
  if (req.query.farmId) var farmId = req.query.farmId;
  Controller.list({
    limit,
    start,
    search,
    farmer,
    farmId
  })
    .then(d => res.json(d))
    .catch(next);
});

router.get("/:id", SecureAPI(), (req, res, next) => {
  Controller.getById(req.params.id)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.post("/", SecureAPI(), async (req, res, next) => {
  Controller.add(req.body)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.put("/:id", SecureAPI(), (req, res, next) => {
  Controller.update(req.params.id, req.body)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.delete("/:id", SecureAPI(), (req, res, next) => {
  Controller.remove(req.params.id)
    .then(d => res.json(d))
    .catch(next);
});

module.exports = router;
