const bcrypt = require("bcrypt");

const jwt = require("../lib/jwt");
const User = require("../models/User");
const { SECRET } = require("../config/constants");

exports.login = async (email, password) => {
  // find user by username
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password!");
  }

  // check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid username or password!");
  }

  const token = await generateToken(user);

  return token;
};

exports.register = async (userData) => {
    const user = await User.findOne({ email: userData.email });
    if (user) {
      throw new Error("Email already exists!");
    }
  
    const createdUser = await User.create(userData);
  
    const token = await generateToken(createdUser);
  
    return token;
  };

  async function generateToken(user) {
  
    //generate token
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    console.log({payload});
  
    const token = await jwt.sign(payload, SECRET, { expiresIn: "2d" });
  
    return token;
  }
  