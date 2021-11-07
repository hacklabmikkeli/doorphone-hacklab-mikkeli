
const syncInterval = 1000 * 60 * 60 * 6
const modemPath = ""
const port = ""
const hassioPort = ""
const apiKey = ""
const hassioApiKey = ""
const memberserverUrl = 'http://localhost:' + port + '/user'
const opendoorUrl = 'http://localhost:' + hassioPort + '/api/webhook/' + hassioApiKey

const loginUrl = ""
const fileUrl = ""
const logOutUrl = ""

const apiPassword = ""
const apiUsername = ""
const mongoUri = ""
const puppeteerOptsWin = {
    headless: true,
}

const puppeteerOptsLinux = {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}

const dicordHodorApiKey = ""

const channelID = ""
const channelIDMembers = ""

const waitOnOpts = {
    resources: [
        loginUrl,
        'https://discord.com'
    ],
    delay: 1000,
    interval: 100,
    simultaneous: 1,
    timeout: 1000 * 6 * 3,
    tcpTimeout: 1000 * 6 * 3,
    window: 1000
}

module.exports = {
    modemPath,
    port,
    apiKey,
    memberserverUrl,
    opendoorUrl,
    logOutUrl,
    loginUrl,
    fileUrl,
    waitOnOpts,
    puppeteerOptsWin,
    puppeteerOptsLinux,
    apiPassword,
    apiUsername,
    mongoUri,
    dicordHodorApiKey,
    channelID,
    syncInterval
}