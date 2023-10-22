const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  // according to the test requirements
    name : {
    type: String,
    required: true,
    minLength: [2, "Creature name should be at least 2 characters"], // minLength: 2,
  },
    species : {
    type: String,
    required: true,
    minLength: [3, "Species name should be at least 2 characters"], // minLength: 2,
  },
  skinColor : {
    type: String,
    required: true,
    minLength: [3, "Creature skinColor should be at least 3 characters"], // minLength: 2,
  },
  eyeColor : {
    type: String,
    required: true,
    minLength: [3, "Creature name should be at least 3 characters"], // minLength: 2,
  },
  image : {
    type: String,
    required: [true, "Image is required"],
    match: [/^https?:\/\//, 'Invalid URL'],
  },
  description : {
    type: String,
    required: true,
    minLength: [5, "Creature desc should be at least 5 characters"], 
    maxLength: [500, "Creature desc should be max 500 characters"], 
  },
  votes: [
    {
      userId: mongoose.Types.ObjectId,
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  
});

const Creature = mongoose.model("Creature", userSchema);

module.exports = Creature;


