const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
dotenv.config();
const app = express();
const PORT = process.env.PORT;

//middleware
app.use(express.json({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//User routes
const authRoute = require("./routes/auth.js");
app.use("/auth", authRoute);

//Track routes
const trackRoute = require("./routes/tracks.js");
app.use("/tracks", trackRoute);

//Track Cart
const cartRoute = require("./routes/cart.js");
app.use("/cart", cartRoute);

app.get("/", (req, res) => {
  res.json({ status: "WORKING" });
});

const db = require("./models");

db.sequelize
  .sync({ alter: true, force: false })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => console.log("app is running"));
  })
  .catch((err) => {
    console.log(err);
  });
