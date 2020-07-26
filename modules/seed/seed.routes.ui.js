const router = require('express').Router();
const { SecureUI } = require('../../helpers/utils/secure');
const Controller = require('./seed.controller');
const FarmController = require('../farm/farm.controller');

router.get('/', SecureUI(), (req, res, next) => {
  res.render('seed/index', {
    title: 'Seed List',
  });
});

router.get('/:id', SecureUI(), async (req, res, next) => {
  const seedInfo = await Controller.getById(req.params.id);
  const seedUuid = seedInfo.uuid;
  res.render('seed/details', {
    title: 'Seed Details',
    data: {
      seedId: req.params.id,
      seedUuid,
    },
  });
});

router.get('/scan/:id', async (req, res, next) => {
  let seedInfo = await Controller.getByUuid(req.params.id);
  const FarmerInfo = await FarmController.getFarmerInfo(seedInfo._id);
  seedInfo = JSON.parse(JSON.stringify(seedInfo));
  const fdata = { ...FarmerInfo[0] };
  seedInfo.caretaker_name = fdata.caretaker_name;
  seedInfo.caretaker_image = fdata.caretaker_image;
  seedInfo.distributor_name = fdata.distributor_name;
  seedInfo.distributor_image = fdata.distributor_image;
  seedInfo.farm_address = fdata.address;
  seedInfo.farm_name = fdata.name;
  if (seedInfo.fertilizer_added) {
    seedInfo.fertilizer_added = 'I was treated with fertilizer';
  } else {
    seedInfo.fertilizer_added = 'I was not treated with fertilizer';
  }
  if (seedInfo.pesticide_added) {
    seedInfo.pesticide_added = 'I was treated with pesticides';
  } else {
    seedInfo.pesticide_added = 'I was not treated with pesticides';
  }
  if (req.cookies.access_token) {
    res.render('seed/details', {
      title: 'Seed Details',
      data: {
        seedId: seedInfo._id,
        seedUuid: seedInfo.uuid,
      },
    });
  } else {
    res.render('seed/consumer', {
      title: 'Crop History',
      seedInfo,
    });
  }
});

module.exports = router;
