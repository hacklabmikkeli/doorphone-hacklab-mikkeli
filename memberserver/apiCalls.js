const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });
const LogModel = require('./models/Log')


module.exports = function () {
    let create, postToDiscord, createLogEntry, getStatForDay

    create = function (config) {
        let token = config.dicordHodorApiKey

        client.login(token).catch((err) => {
            console.log('err no network')
        });

        client.once('ready', () => {
            console.log(`Logged in as ${client.user.tag}!`);
        });
    }

    postToDiscord = function (channelID, name) {
        let channel = client.channels.cache.get(channelID)
        channel.send(`Could not hold the door... ${name} opened it!`).catch((err) => {
            console.log('err cannot send message')
        });
    }

    createLogEntry = function (name) {
        var timestamp = new Date()
        timestamp = timestamp.toLocaleString('fi', { timeZone: 'Europe/Helsinki' })
        var logEntry = new LogModel()
        logEntry.name = name
        logEntry.timestamp = timestamp
        logEntry.save().then(() => console.log('Log entry created')).catch((err) => console.log(err))
    }

    getStatForDay = function (channelID) {
        let channel = client.channels.cache.get(channelID)
        var timestamp = new Date()
        timestamp = timestamp.toLocaleDateString('fi')
        LogModel.find({ "timestamp": { "$regex": timestamp, "$options": "i" } }, (err, docs) => {
            channel.send(`Users was at Hacklab yesterday: ${docs.length}`).catch((err) => {
                console.log('err cannot send message')
            });
        })
    }

    return {
        create: create,
        postToDiscord: postToDiscord,
        createLogEntry: createLogEntry,
        getStatForDay: getStatForDay,
    }
}


