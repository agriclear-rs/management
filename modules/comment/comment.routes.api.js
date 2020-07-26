const router = require("express").Router();
const Controller = require("./comment.controller");
const { SecureAPI } = require("../../helpers/utils/secure");

router.get("/", SecureAPI(), (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  let search = req.query.search || null;
  if (req.query.seed) var seed = req.query.seed;
  if (!seed) return;
  Controller.list({
    limit,
    start,
    search,
    seed
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

router.put("/:id", SecureAPI(), async (req, res, next) => {
  Controller.updateStatus(req.params.id)
    .then(u => res.json(u))
    .catch(e => next(e));
});

module.exports = router;
