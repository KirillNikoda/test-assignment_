const axios = require("axios");
const bcrypt = require("bcrypt");


exports.register = function (channel) {
  return async function (req, res) {
    try {
      let {data} = await axios.get(`http://localhost:3002/users/${req.body.email}`)


      if (data.user) {
        return res.status(400).send({
          err: "User already exists."
        })
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
      data = await axios.post(`http://localhost:3002/users`, req.body)

      channel.sendToQueue("registered", Buffer.from(data.data.user.email))
      res.status(201).send({
        user: data.data.user
      })
    } catch (e) {
      console.log(e.message)
      return res.status(400).send({
        err: "Err"
      })
    }

  };
}

exports.login = function(channel) {
  return async function(req, res) {
    try {
      const {data} = await axios.post(`http://localhost:3002/users/login`, req.body)
      channel.sendToQueue("user_logged_in", Buffer.from(req.body.email))
      res.send({
        token: data.token
      })
    } catch (e) {
      res.status(401).send({
        err: "Invalid credentials."
      })
    }
  }
}