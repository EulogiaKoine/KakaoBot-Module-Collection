// ========= Preprocess ===========
const bot = BotManager.getCurrentBot()
const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
const RPG_LIB_PATH = SD + '/MsgbotLib_MMORPG'
const TEST_ROOM = "프로젝트 - 테스팅 방★"
const FV = '\u200b'.repeat(500)

require('inspire')(this)
inspire('syntax')
inspire('reinforce')
inspire('ui.Chat')
inspire('op.power').boost()

require('inspire')(this, RPG_LIB_PATH, 'rspire')
const { generateID } = rspire('util.generateID')
const { EventObserver, Core, Component, Entity, EntityDTO, EntityFacade, Level, Life, Producer } = rspire('World.base').class
const { Container, Room, Node } = rspire('World.map').class
const { ScriptParser, ScriptManager } = rspire('UI.ScriptManager')

const constants = Object.assign({},
    rspire('World.base').constants
)

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
inspire('extension.String.format')
const ScriptManager0 = {
    src: {
        "profile": " » {name}\nHp: {curr}/{max}\n\n아직은 아무런 의미도 없는 어떤 존재.",
        "intro-whiteroom": "온통 순백으로만 가득찬 공간이다. 주의를 기울이면 희미하게 정육면체를 이루는 모서리의 그림자를 볼 수 있다.",
        "intro-grassland": "지평선 끝까지 펼쳐진 푸른 들판. 선선하게 부는 바람과 함께 평화로운 분위기를 연출하나, 인공적인 고요함 속의 기이함이 피부를 간질이는 듯하다."
    },
    getText(s){
        return this.src[s]
    }
}

function WhiteRoom(){
    Node.call(this, "whiteroom", "하얀 방")
}
inherits(WhiteRoom, Node)

function Grassland(){
    Node.call(this, "grassland", "초원")
}
inherits(Grassland, Node)

const Space = {}

if(true){
    let whiteroom = new WhiteRoom()
    let grassland = new Grassland()
    whiteroom.setContainer(new Container())
    grassland.setContainer(new Container())
    whiteroom.direct(grassland)
    grassland.direct(whiteroom)
    Space.whiteroom = whiteroom
    Space.grassland = grassland
}

const START_POSITION = Space.whiteroom
const UserManager = {
    list: {},
    exists(hash){ return hash in this.list },
    get(hash){ return this.list[hash] },
    /** @assert exists(hash) == false */
    register(hash, name){
        const user = new Entity(name)
        user.setLife(new Life(user))

        const fc = new EntityFacade(user)
        user.setFacade(fc)
        fc.enter(START_POSITION)
        START_POSITION.getContainer().invite(fc)

        this.list[hash] = user
    },
    delete(hash){
        return delete this.list[hash]
    },
    presentProfile(hash){
        const user = this.list[hash]
        return ScriptManager0.getText("profile").format({
            name: user.name,
            curr: user.getLife().getCurrHp(),
            max: user.getLife().getMaxHp()
        })
    }
}

let PREFIX = "" // 최대 1글자, 없으면 없는 취급
function closed_test_0(chat){
    if(chat.room !== TEST_ROOM) return
    if(PREFIX && chat.msg[0] !== PREFIX) return

    const cmd = chat.msg.slice(PREFIX.length).trim().split(' ')

    if(cmd[0] === "소개")
        return chat.reply("카톡봇 가상세계 - Closed Test ver. 0.0.1  ··· 공간 구성")

    if(cmd[0] === "명령어")
        return chat.reply("가능한 명렁어: 입장(i), 프로필(p), 둘러보기(s), 이동(m)")

    if(["i", "입장"].includes(cmd[0])){
        if(UserManager.exists(chat.profileHash))
            return chat.reply('이미 입장한 상태입니다')
        if(cmd[1] === void 0)
            return chat.reply("입장(i) (사용할 닉네임_띄어쓰기 없이) 로 입력해주세요")
        UserManager.register(chat.profileHash, cmd[1])
        return chat.reply("입장 완료. '명령어'를 통해 현재 지원되는 기능을 확인하실 수 있습니다.")
    }

    const user = UserManager.get(chat.profileHash)
    if(user === void 0) return

    if(["p", "프로필"].includes(cmd[0]))
        return chat.reply(UserManager.presentProfile(chat.profileHash))

    if(["s", "둘러보기"].includes(cmd[0])){
        let l = user.getFacade().location
        return chat.reply("👁️‍🗨️ {0}\nTo: {1}\n\n{2}".format(
            l.name,
            l.getDirections().map((v, i) => '('+i+')' + v.name).join(', '),
            ScriptManager0.getText("intro-" + l.id)
        ))
    }

    if(["m", "이동"].includes(cmd[0])){
        if(cmd[1] === void 0)
            return chat.reply("이동(m) (이동할 장소의 번호)")
        let fc = user.getFacade()
        let curr = fc.location
        if(cmd[1] in curr.getDirections()){
            curr.getContainer().kick(fc)
            fc.exit(curr)
            let next = curr.getDirections()[cmd[1]]
            fc.enter(next)
            next.getContainer().invite(fc)
            return chat.reply("{0}으로 이동했습니다.".format(next.name))
        }
        return chat.reply("없는 장소입니다.")
    }
}

listeners.push(closed_test_0)