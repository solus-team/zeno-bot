function config() {
    return{
        "name": "lang",
        "main": "Lang.js",
        "commandMap": {
            "lang": {
                "more": "",
                "des": "Chuyển đổi ngôn ngữ, bot hỗ trợ 15 ngôn ngữ!(Sẽ cập nhật ngôn ngữ sau)",
                "func": "t"
            }
        },
        "langMap" : {
            "lang": {
                "en_US": {
                    "text": "Switched to English"
                },
                "vi_VN": {
                    "text": "Đã chuyển sang Tiếng Việt"
                }
            }
        },
        "nodeDepends":{
            "axios": ""
        },
        "author": "Sou",
        "version": "0.0.1"
    }
}

async function t(event, api) {
    api.sendMessage(global.langm[global.config.lang].text, event.threadID);
}
module.exports = {
    config,
    t
}
