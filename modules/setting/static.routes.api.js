const router = require("express").Router();

const { PM } = require("../../helpers");
const { SecureAPI } = require("../../helpers/utils/secure");
const SettingController = require("./setting.controller");
const config = require("config");
const AWS = config.get("services.aws_s3");
const AWSS3 = require("../../helpers/services/aws");

const AWSCredentials = {
  bucket: AWS.bucket,
  accessKey: AWS.accessKey,
  secret: AWS.secret,
  region: AWS.region
};

router.get("/permissions", (q, r, n) => {
  try {
    let perm = Object.values(PM);
    r.json(perm);
  } catch (e) {
    n(e);
  }
});

router.get("/all", async (req, res, next) => {
  try {
    res.json({});
  } catch (e) {
    next(e);
  }
});

router.post("/getpolicy", (req, res) => {
  let s3 = new AWSS3(AWSCredentials);
  res.json(s3.getPolicy(req.body));
});

module.exports = router;
