const gsmModem = require('serialport-gsm').Modem();
//const config = require('../config/config')
const apiCalls = require('./apiCalls')
let options

module.exports = function() {
    let start

    start = function(config) {
        options = {
            baudRate: 9600,
            dataBits: 8,
            stopBits: 1,
            parity: 'none',
            incomingCallIndication: true,
            pin: ''
        }
        gsmModem.open(config.modemPath, options)
        
        gsmModem.on('open', () => {
            gsmModem.initializeModem((msg, err) => {
                if (err) console.log(err)
                gsmModem.executeCommand('AT+CVHU=0', (result, err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                    console.log(`Result ${JSON.stringify(result)}`);
                })
                gsmModem.setModemMode(msg => console.log('set pdu msg:', msg), 'PDU');
            })
        })
        gsmModem.on('error', result => { console.log(result) })
        gsmModem.on('onNewIncomingCall', result => {
            let number = result.data.number

            apiCalls.getUserPost(config, {number: number, apiKey: config.apiKey})
            gsmModem.hangupCall(() => {console.log('Hangup')})
        })
    }
    return {
        start: start
    }
}

