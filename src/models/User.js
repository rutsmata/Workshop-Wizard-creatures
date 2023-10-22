const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SALT } = require("../config/constants");

const userSchema = new mongoose.Schema({
  // according to the test requirements
  firstName: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, "First name should be at least 3 characters"], // minLength: 2,
  },
  lastName: {
    type: String,
    required: true,
    unique: true,
    minLength: [3, "Last name should be at least 3 characters"], // minLength: 2,
  },
  email: {
    type: String,
    required: true,
    minLength: [10, "Email should be at least 10 characters"],
  },
  password: {
    type: String,
    required: true,
    minLength: [4, "Password should be at least 4 characters"],
  },
});

// validate password
userSchema.virtual("repeatPassword").set(function (value) {
  if (this.password !== value) {
    throw new Error("Password missmatch!");
  }
});

userSchema.pre("save", async function () {
  const hash = await bcrypt.hash(this.password, SALT);

  this.password = hash;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
