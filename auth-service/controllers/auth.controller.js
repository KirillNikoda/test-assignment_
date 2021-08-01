const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async function (req, res) {
  const { email, password } = req.body;
  const user = User.findOne({ email });

  if (user) {
    res.status(400).send({
      err: 'User with that email already exists.',
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

exports.login = async function (req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send({
      err: 'User with that email already exists.',
    });
  }

  const isValidPass = await bcrypt.compare(password, user.password);

  if (!isValidPass) {
    return res.status(400).send({
      err: 'Invalid credentials.',
    });
  }

  const payload = {
    _id: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.send({
    token,
  });
};
