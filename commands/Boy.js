function config(){
    return{
        "name": "Boy",
        "main": "Boy.js",
        "commandMap": {
            "boy": {
                "more": "",
                "des": "Request ảnh trai",
                "func": "boy"
            }
        },
        "nodeDepends":{
            "axios" : ""
        },
        "author": "Sou",
        "version": "0.0.1"
    }
}

async function boy(event, api){
    var axios = require("axios");
    try {
    var boy = {
        body: "Lệnh boy đang tạm tắt để bảo trì vì chưa tìm được API thích hợp!",
        attachment: false
    }
    api.sendMessage(boy ,event.threadID, event.messageID);
    } catch(err) {
        api.sendMessage(err ,event.threadID, event.messageID);
    }
    }

module.exports = {
    boy,
    config
};