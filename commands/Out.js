function config(){
    return{
        "name": "out",
        "main": "Out.js",
        "commandMap": {
            "out": {
                "more": "",
                "des": "out group",
                "func": "out"
            }
        },
        "nodeDepends":{
            "child_process": ""
        },
        "author": "Sou",
        "version": "0.0.1"
    }
}

async function out(event, api) {
	if(event.senderID == global.config.admin) {
		var child_process = require("child_process");
		    api.sendMessage("Đã nhận lệnh rời nhóm từ admin !!!", event.threadID);
		        api.removeUserFromGroup(`100081059280416`, event.threadID);
	} else {
		api.sendMessage('Bạn không phải là admin!', event.threadID, event.messageID);
	}
	}

module.exports = {
    config,
    out
}