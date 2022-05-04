const fs = require("fs");
const login = require("fca-unofficial-force");
const request = require("sync-request");
const axios = require("axios")
const path = require("path");
var child_process = require("child_process");
var date = new Date();
function nonPrefix(event, api){
    for (var name in global.noPrefix){
        try{
            var requireCM = require(global.noPrefix[name].dir);
            var func = global.noPrefix[name].func
            requireCM[func](event, api);
        }
        catch(err){
            console.log(err);
        }
    }
}

function inout(event,api) {
if ( event.logMessageType == "log:subscribe" ){
	if (event.logMessageData.addedParticipants.some(id => id.userFbId == api.getCurrentUserID())) {
		return api.sendMessage(`Solus đã kết nối! Dấu lệnh : ${global.config.prefix}`, event.threadID, () => {
			api.changeNickname(`[${global.config.prefix}]${global.config.botname}`, event.threadID, api.getCurrentUserID());
		});
	} else if (event.logMessageData.addedParticipants.forEach(id => {
		let logsub = async () => {
		var threadID = event.threadID
		var threadInfo = await api.getThreadInfo(threadID)
		var threadName = threadInfo.name
		var userID = id.userFbId;
		api.getUserInfo([userID], (err, userInfo) => {
			var userMentions = `${userInfo[userID].name}`;
		if (userID !== api.getCurrentUserID()) {

			api.sendMessage(`Chào mừng ${userMentions} vào nhóm ${threadName}`, event.threadID);
		}
  })
}
logsub ()
}) 
);
} else if ( event.logMessageType == "log:unsubscribe" ) {
{
	let logunsub = async () => {
		var threadID = event.threadID
		var threadInfo = await api.getThreadInfo(threadID)
		var threadName = threadInfo.name
	var userID = event.logMessageData.leftParticipantFbId;
	api.getUserInfo([userID], (err, userInfo) => {
		var userMentions = `${userInfo[userID].name}`;
		if (userID !== api.getCurrentUserID()) {
			api.sendMessage(`Tạm biệt ${userMentions} đã rời khỏi ${threadName}`, event.threadID);
		}
	})
}
logunsub ()
}
}
}
function runCM(event, api){
    var cm = event.body.slice(global.config.prefix.length, event.body.length);
    var ms = cm.split(" ");
    var ccm = false;
    if(global.plugins.command[ms[0]] != undefined){
        try{
            var requireCM = require(global.plugins.command[ms[0]].dir);
            var func = global.plugins.command[ms[0]].func
			global.langm = global.plugins.lang[ms[0]]
            requireCM[func](event, api);
        }
        catch(err){
            console.log("["+global.plugins.command[ms[0]].namePlugin+"] "+err)
            api.sendMessage(err , event.threadID, event.messageID);
        }
        ccm = true
    }
    if (!ccm) api.sendMessage(`${global.lang.ErrHelp.replace("{0}", global.config.prefix)}` , event.threadID, event.messageID);
}
function listen(event, api){
    switch (event.type) {
        case "log:subscribe":
        case "message_reply":
        case "message":
			if(event.attachments.length != 0){
				console.log(JSON.stringify(event, null, 4));
			}
			else{
				console.logg("\x1b[K" + "\x1b[1;32m" + "\x1b[1;92m" + "\x1b[38;2;0;255;0m" + "[" + (date.getUTCFullYear()+ "-" + (date.getUTCMonth() + 1)+ "-" + date.getUTCDate()+ "T" + date.getUTCHours()+ "-" + date.getUTCMinutes()+ "-" + date.getUTCSeconds()+ "." + date.getUTCMilliseconds()+ "Z") + "]" + " " + `[${event.senderID} đến ${event.threadID}] : ${event.body}`);
			}
            break;
        case "event": 
            break;
        default: 
            if(global.config.logEvent == true)console.log(JSON.stringify(event, null, 4));
    }
    nonPrefix(event, api);
	inout(event,api)
	if(event.body != undefined && event.body.slice(0,global.config.prefix.length) == global.config.prefix){
		args = event.body.slice(global.config.prefix.length).trim().split(/ +/);
		runCM(event, api);
	}
}
async function checkupdate() {
	try {
		const { data } = await axios.get("https://raw.githubusercontent.com/JABD-Team/JABD-Bot-0/master/package.json");
		if (data.version != global.package.version) {
			console.log("Đã có bản cập nhật mới OwO");
		} else {
		console.log("Bạn đang sử dụng phiên bản mới nhất UwU");
		}
	} catch(e) {
		console.error("Đã có lỗi xảy ra.");
		console.error(e)
	}
}
checkupdate()
async function load(api){
    console.loaded("Bot ID : " + api.getCurrentUserID());
    var files = fs.readdirSync('./commands/');
    console.log(`[DONE COMMAND] Đã Load Thành Công : ${files.length} lệnh!`);
    console.log("Bot bắt đầu nhận tin nhắn\n");
	console.logg("Cảm ơn đã sử dụng bot của tôi\n\n")
	console.logg("Đừng Bypass! Hãy tôn trọng những thứ gì mà mình làm ra<3...")
    api.listenMqtt((err, event) => {
        if(err) return console.error(err);

        api.setOptions({
            forceLogin: true,
            listenEvents: true,
            selfListen: config.seflListen
            });
        listen(event, api);
    })
}
function loginn() {
	var filelogin = fs.readdirSync(path.join(__dirname, "..", "../loginfile"))
	if(filelogin.length == 0){
		console.error(('{"error":"Lỗi khi truy xuất userID. Điều này có thể do nhiều nguyên nhân, bao gồm cả việc bị Facebook chặn đăng nhập từ một vị trí không xác định. Hãy thử đăng nhập bằng trình duyệt để xác minh."}'))			
		console.error("Không tìm thấy Login file"),
		console.error("Vui lòng sử dụng tệp .json của J2Team hoặc C3C để đăng nhập..."),
		console.error("Đang tắt bot...") 
		process.exit()
	} else {
		for (var i = 0; i < filelogin.length; i++) {
				if (filelogin[i].endsWith(".json")) {
					var file = filelogin[i]
					var json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "../loginfile", file), 'utf8'));
					if (json.url && json.cookies) {
						console.log("Đã tìm thấy file đăng nhập của J2TEAM...")
						let appstate = [];
						for ( const i of json.cookies) {
							appstate.push({
								key: i.name,
								value: i.value,
								expires: i.expirationDate || "",
								domain: i.domain.replace(".", ""),
								path: i.path
							})
						}
						require("npmlog").emitLog = () => {};
						return login({appState: JSON.parse(JSON.stringify(appstate))}, (err, api) => {
							if(err){
								console.error(JSON.stringify(err))
								console.error('Chưa được đăng nhập');
								fs.unlinkSync(path.join(__dirname, "..", "../loginfile", file))
								return process.exit()
							}
                            console.log('[FACEBOOK] Đã đăng nhập');
							return load(api)
							})
					} else {
						console.log("Đã tìm thấy file đăng nhập của C3C...")
						require("npmlog").emitLog = () => {};
						return login({appState: JSON.parse(JSON.stringify(json))}, (err, api) => {
							if(err){
								console.error(JSON.stringify(err))
								console.error('Chưa được đăng nhập');
								fs.unlinkSync(path.join(__dirname, "..", "../loginfile", file))
								return process.exit()
							}
							console.log('[FACEBOOK] Đã đăng nhập');
							return load(api)
						})
					}
				} else if (filelogin[i].endsWith(".txt")) {
					var atp = fs.readFileSync(path.join(__dirname, "..", "../loginfile", filelogin[i]), 'utf8');
					console.log("Đã tìm thấy file đăng nhập của ATP...")
					const unofficialAppState = []
					const items = atp.split(";|")[0].split(";")
					if (items.length < 2) {
						console.error("Không phải là ATP Cooie")
						process.exit()
					}
					const validItems = ["sb", "datr", "c_user", "xs"]
					let validCount = 0
					for (const item of items) {
						const key = item.split("=")[0]
						const value = item.split("=")[1]
						if (validItems.includes(key)) validCount++
						unofficialAppState.push({
							key,
							value,
							domain: "facebook.com",
							path: "/"
						})
					}
					if (validCount >= validItems.length) {
						require("npmlog").emitLog = () => {};
						return login({appState: JSON.parse(JSON.stringify(unofficialAppState))}, (err, api) => {
							if(err){
								console.error(JSON.stringify(err))
								console.error('Chưa được đăng nhập');
								fs.unlinkSync(path.join(__dirname, "..", "../loginfile", filelogin[i]))
								return process.exit()
							}
							console.log('[FACEBOOK] Đã đăng nhập');
							return load(api)
						})
					} else {
						console.error("Không phải là ATP Cooie")
						fs.unlinkSync(path.join(__dirname, "..", "../loginfile", filelogin[i]))
					}
				} else {
					setTimeout(function () {
						console.error((' {"error":"Lỗi khi truy xuất userID. Điều này có thể do nhiều nguyên nhân, bao gồm cả việc bị Facebook chặn đăng nhập từ một vị trí không xác định. Hãy thử đăng nhập bằng trình duyệt để xác minh."}'))
						console.error("Không tìm thấy file login"),
						console.error("Hãy sử dụng file .json của J2TEAM hoặc C3C để đăng nhập"),
						console.error("Đang tắt bot...")}, 3000)
                        process.exit()
				}
			}
		}
}
module.exports = loginn;

