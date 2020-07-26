const router = require('express').Router();
const Controller = require('./knowledge.controller');
const { SecureAPI } = require('../../helpers/utils/secure');

router.get('/', SecureAPI(), (req, res, next) => {
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  const search = req.query.search || null;
  let name;
  if (req.query.name) name = req.query.name;
  Controller.list({
    limit,
    start,
    search,
    name,
  })
    .then((d) => res.json(d))
    .catch(next);
});

router.get('/:id', SecureAPI(), (req, res, next) => {
  Controller.getById(req.params.id)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.post('/', SecureAPI(), async (req, res, next) => {
  Controller.add(req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.put('/:id', SecureAPI(), (req, res, next) => {
  Controller.update(req.params.id, req.body)
    .then((u) => res.json(u))
    .catch((e) => next(e));
});

router.delete('/:id', SecureAPI(), (req, res, next) => {
  Controller.remove(req.params.id)
    .then((d) => res.json(d))
    .catch(next);
});

module.exports = router;
