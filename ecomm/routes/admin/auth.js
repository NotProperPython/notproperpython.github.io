const express = require("express");
const { handleErrors } = require("./middlewares");

const usersRepo = require("../../repositories/users");
const signupTemplate = require("../../views/admin/auth/signup");
const signinTemplate = require("../../views/admin/auth/signin");
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require("./validators");

// creating a router and then assign it to each route
const router = express.Router();

router.get("/signup", (req, res) => {
  res.send(signupTemplate({ req }));
});
router.get("/signin", (req, res) => {
  res.send(signinTemplate({ req }));
});
router.get("/signout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

router.post(
  "/signin",
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body;
    const user = await usersRepo.getOneBy({ email });

    req.session.userId = user.id;
    res.redirect("/admin/products");
  }
);

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.create({ email, password });

    // create a cookie
    req.session.userId = user.id;

    res.redirect("/admin/products");
  }
);

module.exports = router;
