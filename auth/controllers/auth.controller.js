const {LOGIN_USER} = require("../constants/constants");



exports.login = function (channel) {
    return function (req, res) {
        channel.sendToQueue(LOGIN_USER)
    }
}