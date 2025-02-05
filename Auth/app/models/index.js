const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_URI, { ssl: process.env.DB_SSL })
  .then(() => console.log("MongoDB connected !"))
  .catch(() => console.log("Error with MongoDB connection"));