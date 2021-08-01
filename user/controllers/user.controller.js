const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.createUser = async function (req, res) {
  const { email, password } = req.body;
  const user = User.findOne({ email });

  if (user) {
    res.status(400).send({
      err: "User with that email already exists.",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  await newUser.save();

  res.send(newUser);
};

exports.getUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.send({
      users,
    });
  } catch (e) {
    console.log(e.message);
  }
};
exports.getUser = async function (req, res) {
  const user = await User.findById(req.params.id);
  res.send({
    user,
  });
};
