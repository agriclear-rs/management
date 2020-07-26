const router = require('express').Router();
const Controller = require('./seed.controller');
const { SecureAPI } = require('../../helpers/utils/secure');

router.get('/', SecureAPI(), (req, res, next) => {
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  const search = req.query.search || null;
  let seed;
  let seedId;
  let farmId;
  let batch;
  let crop;
  let variety;
  let farmer;
  let distributor;
  if (req.query.name) seed = req.query.name;
  if (req.query.seedId) seedId = req.query.seedId;
  if (req.query.farmId) farmId = req.query.farmId;
  if (req.query.batch) batch = req.query.batch;
  if (req.query.crop) crop = req.query.crop;
  if (req.query.variety) variety = req.query.variety;
  if (req.query.farmer) farmer = req.query.farmer;
  if (req.query.distributor) distributor = req.query.distributor;
  const [farmerId] = req.ruser.roles.map((d) => {
    if (d === 'Farmer') {
      return req.ruser.farmer_id;
    } return '';
  });
  const [distributorId] = req.ruser.roles.map((d) => {
    if (d === 'Distributor') {
      return req.ruser.distributor_id;
    } return '';
  });
  Controller.list({
    limit,
    start,
    search,
    seed,
    seedId,
    farmId,
    farmerId,
    distributorId,
    distributor,
    batch,
    crop,
    variety,
    farmer,
  })
    .then((d) => res.json(d))
    .catch(next);
});

router.get('/:id', SecureAPI(), (req, res, next) => {
  Controller.getById(req.params.id)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.get('/:uuid', SecureAPI(), (req, res, next) => {
  Controller.getByUuid(req.params.uuid)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.post('/', SecureAPI(), (req, res, next) => {
  Controller.add(req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.post('/:id/post-comment', SecureAPI(), (req, res, next) => {
  Controller.updateComment(req.params.id, req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id', SecureAPI(), (req, res, next) => {
  Controller.update(req.params.id, req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/addFarmer', SecureAPI(), (req, res, next) => {
  Controller.updateFarmer(req.params.id, req.body.farmerId)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/task/add', SecureAPI(), (req, res, next) => {
  Controller.addTask(req.params.id, req.body.task)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/task/update', SecureAPI(), (req, res, next) => {
  Controller.updateTask(req.params.id, req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/removeFarmer', SecureAPI(), (req, res, next) => {
  Controller.removeFarmer(req.params.id, req.body.farmerId)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/removeDistributor', SecureAPI(), (req, res, next) => {
  Controller.removeDistributor(req.params.id, req.body.distributorId)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id/addDistributor', SecureAPI(), (req, res, next) => {
  Controller.updateDistributor(req.params.id, req.body.distributorId)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.delete('/:id', SecureAPI(), (req, res, next) => {
  Controller.remove(req.params.id)
    .then((d) => res.json(d))
    .catch(next);
});

module.exports = router;
