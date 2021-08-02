const jwt = require("jsonwebtoken")
const {User} = require("../models/user.model");

exports.authMiddleware = async function (req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.send(401).send({
      err: "Unauthorized.",
    });
  }


  const decryptedPayload = await jwt.decode(token);


  const user = await User.findById(decryptedPayload._id);


  if (!user) {
    return res.send(401).send({
      err: "Unauthorized.",
    });
  }

  req.user = user;

  next()
};
