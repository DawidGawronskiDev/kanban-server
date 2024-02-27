require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
const express = require("express");
const app = express();

// stric mode
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("Connected!"));

const authRoutes = require("./routes/auth-routes");

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRECT_KEY,
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
