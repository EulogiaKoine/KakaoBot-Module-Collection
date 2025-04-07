//================= Env ==================
const bot = BotManager.getCurrentBot()
const power = require('op/power')
power.on()

const stop = () => java.lang.System.exit(0)

const Message = require('KP/Message')
//================= Env ==================


//=============== Const ==================
const SD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
const TEST_PATH = SD+'/테스트'
const BOT_PATH = com.xfl.msgbot.utils.SharedVar.Companion.getBotsPath().split('/').slice(0, -1).join('/')
const FV = '\u200b'.repeat(500)
const TEST_ROOM = "프로젝트 - 테스팅 방★"
//=============== Const ==================



//============== Eval ==============
const { EvalAdmin, Evaluator, EvalManager } = require('op/EvalManager')
const evalManager = new EvalManager(BOT_PATH + "/operation/eval_config.json")
evalManager.load()
//============== Eval ==============


//=============== Pack: 와! ==============
const dl = require('DeepLearning')
const Arr = dl.Arr
const ds = require('ds')
const Sqlite = require('Sqlite')
const { Calculator, Sign } = require('Calculator')
const dayjs = require('dayjs')
const { Genetic, SolveFn } = require('GeneticAndSolveFn')
const stats = require('stats');
//=============== Pack: 와! ==============


//============== Pack: 시럽 ==============
const SYRUP = SD + '/SYRUP'
const ify = o => JSON.stringify(o, null, 3)
//============== Pack: 시럽 ==============


//============== Main ==============
bot.addListener(Event.MESSAGE, onMessage);

function onMessage(msg){
    if(msg.content == "!!test!!"){
        msg.reply(`
            msg.content = ${msg.content}
            msg.room = ${msg.room}
            msg.author = {
                name: ${msg.author.name}
                avatar.getBase64(): ${java.lang.String(msg.author.avatar.getBase64()).hashCode()}
            }
            msg.isGroupChat: ${msg.isGroupChat}
            msg.isDebugRoom: ${msg.isDebugRoom}
            msg.packageName: ${msg.packageName}
        `.trim());
        return;
    }


    msg = new Message(msg);

    var eval_scope = Object.create(globalThis);
    eval_scope.msg = msg;
    evalManager.eval(msg, eval_scope);
    Object.keys(eval_scope).forEach(v => globalThis[v] = eval_scope[v]);

    // if((msg.room === "프로젝트 - 테스팅 방★" || !msg.isGroupChat) && msg.content.startsWith("e")){
    //     let code = msg.content.slice(1).trim()
    //     try {
    //         let start, time;
    //         code = "start = Date.now();" + code;
    //         const res = eval(code);
    //         time = Date.now() - start;
    //         msg.reply(
    //             "⏱˚ " + (time/1000) + " sec.\n"
    //             + res
    //         )
    //     } catch(e) {
    //         msg.reply("☢ " + e.name + "  ··· " + e.lineNumber
    //             + "\n" + e.message
    //         )
    //     }    
    // }
}