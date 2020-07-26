const router = require("express").Router();
const Controller = require("./farm.controller");
const { SecureAPI } = require("../../helpers/utils/secure");

router.get("/", SecureAPI(), (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  let search = req.query.search || null;
  if (req.query.name) var farm = req.query.name;
  if (req.query.farmId) var farmId = req.query.farmId;
  if (req.query.farm_id) var farm_id = req.query.farm_id;
  if (req.query.owner) var owner = req.query.owner;
  let [farmerId] = req.ruser.roles.map(d => {
    if (d === "Farmer") {
      return req.ruser.farmer_id;
    } else return "";
  });
  let [distributorId] = req.ruser.roles.map(d => {
    if (d === "Distributor") {
      return req.ruser.distributor_id;
    } else return "";
  });
  Controller.list({
    limit,
    start,
    search,
    farmId,
    farmerId,
    distributorId,
    farm,
    farm_id,
    owner
  })
    .then(d => res.json(d))
    .catch(next);
});

router.get("/:id", SecureAPI(), (req, res, next) => {
  Controller.getById(req.params.id)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.post("/", SecureAPI(), (req, res, next) => {
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

router.put("/:id/removeFarmer", SecureAPI(), (req, res, next) => {
  Controller.removeFarmer(req.params.id, req.body.farmerId)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.put("/:id/removeDistributor", SecureAPI(), (req, res, next) => {
  Controller.removeDistributor(req.params.id, req.body.distributorId)
    .then(u => res.json(u))
    .catch(e => next(e));
});


module.exports = router;
