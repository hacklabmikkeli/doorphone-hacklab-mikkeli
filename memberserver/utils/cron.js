const cron = require('cron')
const LogModel = require('../models/Log')
const apiCalls = require('../apiCalls')()
const config = require('../../config/config')

function startCronJobs() {
    const postStats = cron.job('0 0 0 * * *', function () {
        apiCalls.getStatForDay(config.channelID)
    })
    postStats.start();
}


module.exports = {
    startCronJobs: startCronJobs,
}