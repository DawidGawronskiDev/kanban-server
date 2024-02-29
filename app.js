require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
const express = require("express");
const app = express();

const passport = require("passport");
const session = require("express-session");
const MongoDBSessionStore = require("connect-mongodb-session")(session);

const authRoutes = require("./routes/auth-routes");

require("./config/passport-config");

// stric mode
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log("Connected!"));

const store = new MongoDBSessionStore({
  uri: process.env.DATABASE_URI,
  collection: "sessions", // Collection name to store sessions
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: store,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies)
  }),
);
app.options("*", cors());

app.get("/", (req, res) => {
  if (req.session.viewCount) {
    req.session.viewCount = req.session.viewCount + 1;
  } else {
    req.session.viewCount = 1;
  }

  res.json({
    msg: "Hello!",
    session: req.session,
    viewCount: req.session.viewCount,
  });
});

app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
