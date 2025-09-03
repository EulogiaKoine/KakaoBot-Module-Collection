//================= Env ==================
const bot = BotManager.getCurrentBot()
require('inspire')(this)

inspire('syntax')
inspire('extension')
inspire('reinforce')
inspire('util')
inspire('op.DecodeFuncString')
inspire('op.power').boost()

bot.addListener(Event.START_COMPILE, function(){
    ThreadManager.stopAll()
})
//================= Env ==================


//=============== Const ==================
const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
const TEST = SD+'/테스트'
const FV = '\u200b'.repeat(500)
const stop = () => java.lang.System.exit(0)
//=============== Const ==================


//=============== Pack: 와! ==============
const dl = require('DeepLearning')
const Arr = dl.Arr
const ds = require('ds')
const Sqlite = require('Sqlite')
const { Calulator, Sign } = require('Calculator')
//=============== Pack: 와! ==============


//============== Pack: 시럽 ==============
const SYRUP = SD + '/SYRUP'
//============== Pack: 시럽 ==============


//============== Pack: PIPI ==============
const PIPI = SD + '/PIPi'
//============== Pack: PIPI ==============


//================= UI ===================
inspire('ui.Chat')
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

const listeners = []
bot.addListener(Event.NOTIFICATION_POSTED, function(sbn){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat && op.room.includes(chat.room))
        listeners.forEach(fn => fn(chat))
})

const nanoTime = java.lang.System.nanoTime
listeners.push(function evaluate(chat){
    if(chat.msg.startsWith('e') && op.admin.indexOf(chat.profileHash)){
        let { room, msg, sender, isGroupChat, isMention, isMultiChat } = chat
        let rp = rp_constructor(chat)

        try{
            let $timeout
            const $result = eval(
                "void ($timeout = nanoTime());\n"
                + msg.slice(1)
            )
            chat.reply(eval_style.result(Math.max(0, nanoTime() - $timeout - 5000) / 1000000000, $result))
        } catch(e) {
            chat.reply(eval_style.error(e))
        }
    }
})
//================= UI ===================


//================ Main ==================
