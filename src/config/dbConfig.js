const mongoose = require("mongoose");

const { URI } = require("./constants");

async function dbConnect() {
  await mongoose.connect(URI);
}

module.exports = dbConnect;
