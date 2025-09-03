// ========= Preprocess ===========
const bot = BotManager.getCurrentBot()
const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
const PATH = SD + '/RPG'
const TEST_ROOM = "프로젝트 - 테스팅 방★"
const FV = '\u200b'.repeat(500)

require('inspire')(this)
inspire('syntax')
inspire('reinforce')
inspire('ui.Chat')
inspire('op.power').boost()

bot.addListener(Event.START_COMPILE, function(){
    ThreadManager.stopAll()
})
// ========= Preprocess ===========


// ============= UI ===============
const listeners = []
const rp_constructor = inspire('op.evaluate.rp_constructor').rp_constructor
rp_constructor.count = 10
const eval_style = inspire('op.evaluate.style')
const op = {
    admin: Database.readObject('admin'),
    room: Database.readObject('room'),
    save(){
        Database.writeObject('admin', this.admin)
        Database.writeObject('room', this.room)
    }
}

bot.addListener(Event.NOTIFICATION_POSTED, function(sbn){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat){
      if(!chat.isGroupChat || op.room.includes(chat.room)){
        try{
           listeners.forEach(fn => fn(chat))
        } catch(e){
          Log.e(e)
        }
      }
    }
})

function serif(a, b) {
    let ab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", sb = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳";
    if (b) {
        ab += "1234567890";
        sb += "𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗𝟎";
    }
    a = String(a);
    for (i = 0; i < ab.length; i++) {
        a = a.replace(new RegExp(ab[i], "g"), sb[i * 2] + (sb[i * 2 + 1] || "")).replace(/·/g, "•");
    }
    return a;
}
eval_style.result = (t, r) => "⚔ " + serif(t + " sec.\n", true) + r
eval_style.error = e => {
    if(e.stack)
        e.stack = e.stack.split("\n").slice(0, -2).join("\n")
    return "⛛ " + serif(e.name) + " \xb7\xb7\xb7 " + serif(''+Math.max(0, (e.lineNumber - 1)), true) + "\n " + e.message + ((e.stack && e.stack.trim()) ? "\u200b".repeat(500) + "\n" + e.stack : "");
}

const nanoTime = java.lang.System.nanoTime
function evaluate(chat) {
    if (chat.msg === "!hash") {
        chat.reply(chat.profileHash);
        return;
    }
    if (chat.msg.startsWith("r") && (chat.room === TEST_ROOM || op.admin.indexOf(chat.profileHash) !== -1)) {
        let {room, msg, sender, isGroupChat, isMention, isMultiChat} = chat;
        let rp = rp_constructor(chat);
        try {
            let $timeout;
            const $result = eval("void ($timeout = nanoTime());\n" + msg.slice(1));
            chat.reply(eval_style.result(Math.max(0, nanoTime() - $timeout - 5000) / 1000000000, $result));
        }
        catch (e) {
            chat.reply(eval_style.error(e));
        }
    }
}

listeners.push(evaluate)
// ============= UI ===============


// ============= Main =============
const { ScriptManager, ScriptParser } = inspire('rpg.ScriptManager')
ScriptParser.setDirectory(PATH + '/script')
ScriptManager.optimize(true)

const UserManager = inspire('rpg.UserManager')
const UserDAO = inspire('rpg.UserDAO')
UserDAO.setManager(UserManager)



let rg_cmd = "가입"
function register_cmd(chat){
    if(UserManager.getByHash(chat.profileHash) === null)
        return chat.reply(ScriptManager.getText('cmd.registeration_fail'))
    const pw = chat.msg.slice(rg_cmd).trim()
    if(UserManager.PASSWORD_REG.test(pw)){
        UserManager.register(hash, pw)
    }
}