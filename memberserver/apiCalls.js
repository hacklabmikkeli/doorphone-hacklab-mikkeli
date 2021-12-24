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

    postToDiscord = function (channelID, name, access) {
        let channel = client.channels.cache.get(channelID)
        let msg = ""
        if (access) {
            msg = `Could not hold the door... ${name} opened it!`
        } else {
            msg = `I kept the door closed... Someone tried open it...`
        }
        channel.send(msg).catch((err) => {
            console.log('err cannot send message')
        });
    }

    createLogEntry = function (name, access) {
        var timestamp = new Date()
        timestamp = timestamp.toLocaleString('fi', { timeZone: 'Europe/Helsinki' })
        var logEntry = new LogModel()
        logEntry.name = name
        logEntry.timestamp = timestamp
        logEntry.access = access
        logEntry.save().then(() => console.log('Log entry created')).catch((err) => console.log(err))
    }

    getStatForDay = function (channelID) {
        let channel = client.channels.cache.get(channelID)
        var timestamp = new Date()
        timestamp.setDate(timestamp.getDate() - 1)
        timestamp = timestamp.toLocaleDateString('fi')

        console.log(timestamp)
        LogModel.find({ $and: {"access": true, "timestamp": { "$regex": timestamp, "$options": "i" }} }, (err, docs) => {
            if (docs.length <= 0) {
                channel.send(`Please more visitors NOW`).catch((err) => {
                    console.log('err cannot send message')
                });
            } else {
                channel.send(`${docs.length} User(s) was at Hacklab yesterday `).catch((err) => {
                    console.log('err cannot send message')
                });
            }

        })
    }

    return {
        create: create,
        postToDiscord: postToDiscord,
        createLogEntry: createLogEntry,
        getStatForDay: getStatForDay,
    }
}


