//const config = require('../config/config')
const express = require('express')
const cors = require('cors')
const UserModel = require('./models/User')
const apiCalls = require('./apiCalls')()


module.exports = function () {
    let app = express();
    let create
    let start

    create = function (config) {

        app.use(cors())
        app.use(express.json());
        app.set('port', config.port)
        app.use(function (err, req, res, next) {
            res.send("Error occured " + err.statusCode)
        })

        app.post('/user', (req, res) => {
            let apiKey = req.body.apiKey
            if (apiKey === config.apiKey) {
                UserModel.findOne({ phone: req.body.number }, (err, user) => {
                    if (err || !user) {
                        return res.json({ success: false })
                    }
                    apiCalls.createLogEntry(user.name)
                    apiCalls.postToDiscord(config.channelID, user.showName ? user.name : 'Someone')
                    return res.json({ success: true })
                });
            }
        })
    }

    start = function () {
        let port = app.get('port')
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`)
        })
    }
    return {
        create: create,
        start: start
    }

}



