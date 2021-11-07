const axios = require('axios');


function getUserPost (config, data){
    axios({
        method: 'post',
        url: config.memberserverUrl,
        data: data,
    }).then((res) => {
        if(res.status == 200 && res.data.success) {
            axios({
                method: 'post',
                url: config.opendoorUrl
            }).then((res) => {
                if(res.status === 200) {
                    console.log('Door opened')
                }
            }).catch((err) => {
                console.log('Cannot open door -- no post route')
            })
        } else {
            console.log('Not opening')
        }
    }).catch((err) => {
        console.log(err)
    })
}

module.exports = {
    getUserPost: getUserPost
}