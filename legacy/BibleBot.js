const bot = BotManager.getCurrentBot()
require('inspire')(this)

const Bible = require('Bible')

const Chat = require('Chat')
bot.addListener(Event.NOTIFICATION_POSTED, function(sbn){
    const chat = new Chat(sbn)
    if(chat.isKakaoChat)
        onMessage(chat)
})

const YOUTUBE_API_KEY = "AIzaSyBOwW0p0-8LMlf5LOyPAiW1j6Aa_mxAlUA"
const PREFIX = "."
const FV = '\u200b'.repeat(500)
const CMDS = {}

function onMessage(chat){
    if(chat.msg.startsWith(PREFIX)){
        const cmd = chat.msg.slice(PREFIX.length).trimStart().split(' ')
        if(cmd[0] in CMDS)
            CMDS[cmd[0]](cmd.slice(1), chat.room)
    }
}


const HELP_TXT = "  [ 성경봇 도움말 ]\n> 클릭하여 확인" + FV
    + "\n(*아래 양식대로 채팅으로 명령어를 치시면 돼요)\n"
    + "\n\n.도움말 : 이 메시지를 다시 띄울 수 있습니다."
    + "\n\n.성경 (책 이름) (장) 말씀을 불러올 수 있습니다. 개역개정 버전입니다."
    + "\n  - 예) .성경 창세기 1   -> 창세기 1장"
    + "\n\n.찬송 (장) : 해당 장의 찬송가를 불러옵니다. 새찬송가 기준입니다."
    + "\n  - 예) .찬송 122"
CMDS["도움말"] = function(_, room){
    bot.send(room, HELP_TXT)
}

CMDS["성경"] = function(args, room){
    if(args[0] in Bible.BookCode){
        const verses = Bible.getVerse(args[0], args[1])
        bot.send(room, "📖" + args[0] + " " + args[1] + "" + FV
            + "\n\n\n" + verses.map((v, i) => (i+1) + '. ' + v).join('\n\n'))
    } else {
        bot.send(room, "알맞은 이름을 입력해주세요!\n(*요한서신 같은 경우 요한1, 2서 처럼 숫자를 사용해주세요.")
    }
}

CMDS["찬송"] = function(args, room){
    if(isNaN(args[0])){
        bot.send(room, "찬송가 번호를 입력해주세요.")
    } else {
        const hymn = Bible.getHymn(args[0])
        const video_data = JSON.parse(org.jsoup.Jsoup.connect('https://www.googleapis.com/youtube/v3/search?key='+YOUTUBE_API_KEY)
            .header('part', 'snippet').data('q', '찬송가 122').ignoreContentType(true).get().text())
        const url = "https://www.youtube.com/watch?v=" + video_data.items[0].id.videoId
        bot.send(room, Bible.stringifyHymn(hymn, args[0]) + FV + '\n\n\n' + url)
    }
}