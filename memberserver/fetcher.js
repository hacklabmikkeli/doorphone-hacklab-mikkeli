
const puppeteer = require('puppeteer')
const XLSX = require('xlsx');
const mongoose = require('mongoose');
const UserModel = require('./models/User')
const path = require('path');
const downloadPath = path.resolve('./memberserver/download');
const { readdirSync, unlinkSync } = require('fs');


module.exports = function () {
    let sync, create

    sync = function (config) {
        console.log('Starting sync process')
        getDataFromYhdistysavain(config)
    }

    create = function (config) {
        mongoose.connect(config.mongoUri).catch((err) => {
            console.log('err occured on mongoose')
            return
        })
        sync(config)

        setInterval(() => {
            sync(config)
        }, config.syncInterval);

    }
    return {
        sync: sync,
        create: create
    }


}



async function getDataFromYhdistysavain(config) {
    let opts = config.puppeteerOptsWin
    const browser = await puppeteer.launch(opts)

    let files = readdirSync(downloadPath)
    files.forEach(file => unlinkSync(downloadPath + `/${file}`))

    const page = await browser.newPage()

    await page.goto(config.loginUrl, { waitUntil: 'networkidle0' })
    await page.type('#u_id', config.apiUsername)
    await page.type('#u_password', config.apiPassword)

    await Promise.all([
        page.click('.submit'),
        page.waitForNavigation({},)
    ])

    await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath,
    });

    await page.goto(config.fileUrl, { waitUntil: 'networkidle2' }).catch(e => void 0)

    await Promise.all([
        page.goto(config.logOutUrl, { waitUntil: 'networkidle0' }),
        page.waitForNavigation({},)
    ])

    await browser.close()

    files = readdirSync(downloadPath)
    if (files.length > 1) {
        console.log('Too many files')
        return
    }

    files.forEach(file => handleData(file));


}


const getStringValue = (cell, row, worksheet) => {
    if (worksheet[XLSX.utils.encode_cell({ c: cell, r: row })] && worksheet[XLSX.utils.encode_cell({ c: cell, r: row })].v) {
        return worksheet[XLSX.utils.encode_cell({ c: cell, r: row })].v;
    }

    return null;
};


async function handleData(file) {
    const workbook = XLSX.readFile(downloadPath + '/' + file);
    const sheetName = Object.keys(workbook.Sheets)[0];
    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const results = [];

    for (let row = 1; row <= range.e.r; row++) {
        let phone = getPhoneValue(4, row, worksheet);
        let monthlyUser20 = getBooleanValue(8, row, worksheet);
        let monthlyUser40 = getBooleanValue(9, row, worksheet);
        let userBanned = getBooleanValue(12, row, worksheet);

        if ((!monthlyUser20 && !monthlyUser40) || userBanned) {
            continue;
        }

        let fname = getStringValue(0, row, worksheet);
        let lname = getStringValue(1, row, worksheet);

        let showName = getBooleanValue(11, row, worksheet);

        results.push({
            name: `${fname} ${lname}`,
            phone: phone,
            showName: showName,
        });
    }

    UserModel.deleteMany({}, () => {
        console.log('Old users removed');
        const userCreatePromises = [];
        for (let i = 0; i < results.length; i++) {
            let user = new UserModel();
            user.name = results[i].name;
            user.phone = results[i].phone;
            user.showName = results[i].showName;
            userCreatePromises.push(user.save());
        }

        Promise.all(userCreatePromises)
            .then(() => {
                console.log('Users imported');

            })
            .catch((err) => {
                console.log(err);
            });
    });




}

const getBooleanValue = (cell, row, worksheet) => {
    const stringValue = getStringValue(cell, row, worksheet);

    if (!stringValue) {
        return false;
    }

    return stringValue.replace(/ /g, '') === 'X';
};

const getPhoneValue = (cell, row, worksheet) => {
    let stringValue = getStringValue(cell, row, worksheet);
    if (!stringValue) {
        return null;
    }

    stringValue = stringValue.replace(/ /g, '');
    if (stringValue.startsWith('0')) {
        stringValue = '+358' + stringValue.substring(1);
    }

    return stringValue ? stringValue : null;
};