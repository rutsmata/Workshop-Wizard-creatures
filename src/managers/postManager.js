const Creature = require("../models/Creature");

exports.create = (postData) => Creature.create(postData); //1. to store in db

exports.getAll = () => Creature.find().populate("owner"); //2. upon dynamic logic ready; Populate is important to be able to get the owner's details (as per the User Model), needed in the petPhoto.hbs

exports.getOne = (postId) => Creature.findById(postId).populate("owner"); //3. upon details page - get one db element by Id

exports.delete = (postId) => Creature.findByIdAndDelete(postId); // 4. upon delete functionality

exports.edit = (postId, postData) =>
  Creature.findByIdAndUpdate(postId, postData); // 5. upon edit - extract a certain photo and edit its data

exports.getByOwner = (userId) => Creature.find({ owner: userId }); // find those where owner = userId; get all photos of this owner
