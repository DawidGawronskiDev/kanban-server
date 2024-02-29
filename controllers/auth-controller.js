const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user-model");

exports.signup_get = asyncHandler(async (req, res) => {
  res.send("GET Signup!");
});

exports.signup_post = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: "1" })
    .withMessage("Username has to be specified"),
  body("password")
    .trim()
    .escape()
    .isLength({ min: "1" })
    .withMessage("Password has to be specified"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Extract error messages
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ username: username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }),
];

exports.login_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res
        .status(200)
        .json({
          message: "Logged in successfully",
          user: { username: user.username, id: user._id },
        });
    });
  })(req, res, next);
};
