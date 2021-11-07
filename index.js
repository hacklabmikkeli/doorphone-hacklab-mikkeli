const doorphone = require('./doorphone')()
const memberserver = require('./memberserver')()
const fetcher = require('./memberserver/fetcher')()
const config = require('./config/config')
const waitOn = require('wait-on')
const apiCallsDiscord = require('./memberserver/apiCalls')()
const cronJobs = require('./memberserver/utils/cron')
var startSyncInterval

memberserver.create(config)
memberserver.start()
doorphone.start(config)
cronJobs.startCronJobs();

startSyncAndDiscord()

function startSyncAndDiscord() {
    clearInterval(startSyncInterval)

    waitOn(config.waitOnOpts).then(() => {
        apiCallsDiscord.create(config)
        fetcher.create(config)
    }).catch((err) => {
        console.log('Cannot start sync or discord Api')
        startSyncInterval = setInterval(() => {
            startSyncAndDiscord()
        }, config.waitOnOpts.tcpTimeout + 1000 * 5);
    })
}


