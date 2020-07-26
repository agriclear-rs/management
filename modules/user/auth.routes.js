const passport = require("passport");
const config = require("config");
const router = require("express").Router();
const UserController = require("./user.controller");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res, next) => {
  try {
    let user = await UserController.login(req.body);
    res.cookie("access_token", user.token);
    res.json({ access_token: user.token });
  } catch (e) {
    next(e);
  }
});

router.get("/auth", async (req, res, next) => {
  try {
    const token = req.query.access_token || req.headers["access_token"] || req.cookies.access_token;
    let tokenData = await UserController.validateToken(token);
    let user = await UserController.getById(tokenData.data.user_id);
    res.json({
      user,
      access_token: token,
      permissions: tokenData.data.permissions
    });
  } catch (e) {
    next(e);
  }
});

router.post("/auth", async (req, res, next) => {
  try {
    let user = await UserController.login(req.body);
    let tokenData = await UserController.validateToken(user.token);
    res.json({
      user,
      access_token: user.token,
      permissions: tokenData.data.permissions
    });
  } catch (e) {
    next(e);
  }
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("permissions");
  res.clearCookie("access_token");
  res.clearCookie("redirect_url");
  res.clearCookie("user");
  res.clearCookie("user_id");
  res.redirect("/login");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

router.get("/passport-control", async (req, res, next) => {
  try {
    let tokenData = await UserController.validateToken(req.cookies.access_token);
    res.render("auth/passport-control", {
      title: "Passport Control",
      access_token: req.cookies.access_token,
      redirect_url: req.cookies.redirect_url,
      user_fname: tokenData.data.name_first,
      user_name: tokenData.data.name
    });
  } catch (e) {
    res.clearCookie("access_token");
    res.redirect("/login");
  }
});

if (config.has("services.facebook")) {
  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email"]
    })
  );
}

if (config.has("services.google")) {
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      userProperty: {}
    })
  );
}

router.get("/auth/:strategy/callback", async (req, res, next) => {
  __promisifiedPassportAuthentication(req.params.strategy, req, res)
    .then(d => {
      res.cookie("access_token", d.token);
      res.redirect("/passport-control");
    })
    .catch(e => {
      res.render("misc/message", {
        message: e
      });
    });
});

function __promisifiedPassportAuthentication(strategy, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategy, { session: false }, (err, user, details) => {
      if (err) reject(new Error(err));
      else if (!user) reject(details.message);
      resolve(user);
    })(req, res);
  });
}

module.exports = router;
