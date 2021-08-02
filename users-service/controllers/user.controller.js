const {User} = require("../models/user.model");

exports.getAllUsers = async function (req, res) {
    try {
        const users = await User.find();
        res.send({
            users
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).send({
            err: "Server error."
        })
    }

}