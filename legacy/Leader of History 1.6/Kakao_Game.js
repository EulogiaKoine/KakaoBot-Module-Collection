// ========== Base Preprocessing ==========
require('inspire')(this)
inspire('op.power').boost()
inspire('op.DecodeFuncString')
inspire('syntax')
inspire('reinforce.event_loop')

const bot = BotManager.getCurrentBot()

const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
// ========== Base Preprocessing ==========



// ========== Global Constants ==========
const FV = '\u200b'.repeat(500)
// ========== Global Constants ==========



// ========== Tools ETC ==========
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

const ify = obj => JSON.stringify(obj, null, 4)

const requireInstant = path => {
    const module = { exports: {} }
    const content = FileStream.read(path)
    if(content === null)
        return null
    eval(content)
    return module.exports
}
// ========== Tools ETC ==========



// ========== UI ==========
const SessionManager = inspire('ui.SessionManager')
SessionManager.optimize(true)
bot.send = SessionManager.send
const { Chat } = inspire('ui.Chat')

SessionManager.bringSessionsFromApp('com.kakao.talk')
    .forEach(v => {
        if(!(v.send === null || v.send.remoteInputs === null)) SessionManager.setSendSession(v.key, v.send)
        if(v.read !== null) SessionManager.setReadSession(v.key, v.read) 
    })

const TEST_ROOM = "프로젝트 - 테스팅 방★"
const WORKING_ROOMS = [
    "프로젝트 - 테스팅 방★","잉여서점 · 역사의 인도자","프로젝트 - 논의 및 소통방★",
    "잉여서점★"
]
const admin = Database.readObject('admin')

/** @type {Function(chat: Chat)[]} 채팅 리스너들*/
const chat_listeners = []

// eval listener setting
const rp_constructor = inspire('op.evaluate.rp_constructor').rp_constructor
rp_constructor.count = 10
const eval_style = inspire('op.evaluate.style')
eval_style.result = (t, r) => "⚔️ " + serif(t + " sec.", true) + "\n" + r
eval_style.error = e => {
    if(e.stack)
        e.stack = e.stack.split("\n").slice(0, -2).join("\n");
    return "⚠️ " + serif(e.name) + " ··· " + serif(''+Math.max(0, (e.lineNumber - 1)), true)
        + "\n " + e.message + ((e.stack && e.stack.trim())? FV + "\n" + e.stack: '')
}
const evaluate_listener = (() => {
    const nanoTime = java.lang.System.nanoTime
    return function evaluate(chat){
        if(chat.msg.startsWith('g') && admin.indexOf(chat.profileHash) !== -1){
            let rp = rp_constructor(chat)

            try{
                let $timeout
                const $result = eval(
                    "void ($timeout = nanoTime());\n"
                    + chat.msg.slice(1)
                )
                chat.reply(eval_style.result(Math.max(0, nanoTime() - $timeout - 5000) / 1000000000, $result))
            } catch(e) {
                chat.reply(eval_style.error(e))
            }
        }
    }
})()

// 알림 리스너
const notification_listener = sbn => {
    if(sbn.packageName === "com.kakao.talk" && sbn.tag !== null){
        const acts = sbn.notification.actions
        if(acts !== null && acts.length === 2){
            let send = null, read = null
            acts.forEach(v => {
                if(v.remoteInputs === null) read = v
                else send = v
            })
            if(send === null || read === null)
                return

            const chat = new Chat(sbn)

            // 단체톡이면서 허용된 방이 아닐 경우
            if(chat.isGroupChat && WORKING_ROOMS.indexOf(chat.room) === -1)
                return

            // 방ID로 등록
            SessionManager.setSendSession(sbn.tag, send)
            SessionManager.setReadSession(sbn.tag, read)
            // 방 이름으로 등록
            SessionManager.setSendSession(chat.room, send)
            SessionManager.setReadSession(chat.room, read)

            evaluate_listener(chat) // 별개로 작동

            chat_listeners.forEach(f => f(chat))
        }
    }
}

bot.addListener( Event.NOTIFICATION_POSTED, notification_listener )
// ========== UI ==========



// ========== Main - LOH ==========
const ROOT_PATH = SD + '/Kakao_Game'
const LOH_PATH = ROOT_PATH + '/loh'

require('inspire')(this, ROOT_PATH, 'gspire')

const { EventEmitter } = inspire('util.events')
const { Clock } = gspire('util.Clock')
const { BallotBox } = gspire('util.BallotBox')
const UserManager = gspire('util.UserManager')
const UserDAO = gspire('util.UserDAO')
UserDAO.setDirectory(ROOT_PATH + '/temp_users')
UserDAO.setManager(UserManager)
UserDAO.load()

const { AbilityProxy } = gspire('loh.AbilityProxy')
const { Bag } = gspire('loh.Bag')
const { Job } = gspire('loh.Job')
const { Life } = gspire('loh.Life')
const GLog = gspire('loh.Log').Log
const LOHJobDistributor = gspire('loh.LOHJobDistributor')
const { Team } = gspire('loh.Team')
const { LOHTeam } = gspire('loh.LOHTeam')
const { Player } = gspire('loh.Player')