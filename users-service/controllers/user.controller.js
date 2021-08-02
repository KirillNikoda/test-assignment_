const {User} = require("../models/user.model");

exports.getUser = async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        res.send({
            user
        })
    } catch (e) {
        console.log(e.message)
        res.status(500).send({
            err: "Server error."
        })
    }
}

exports.updateUser = async function(req, res) {
    const user = await User.findById(req.params.id);


    if (user._id.toString() !== req.user._id.toString()) {
        return res.status(401).send({
            err: "Unauthorized."
        })
    }


    try {
        await User.findByIdAndUpdate(req.params.id, req.body)
        res.send({
            user: req.body
        })
    } catch (e) {
        console.log(e.message);
        res.status(500).send({
            err: "Server error."
        })
    }
}