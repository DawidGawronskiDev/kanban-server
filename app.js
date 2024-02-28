require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const passport = require("passport");
const session = require("express-session");

require("./config/passport-config");

// stric mode
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("Connected!"));

const authRoutes = require("./routes/auth-routes");

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello!" });
});

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
