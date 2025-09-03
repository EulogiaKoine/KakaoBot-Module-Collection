const scriptName = "Leader_of_History";
const prefix = " 🎲[ Leader of History ]🎲\n";
const eventBot = "역사의 인도자 - 이벤트";
const adminName = "미러";
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

const Module_Game = require(sdcard+'/Leader_of_History/1.5/Modules/Game.js');
const Module_Event = require(sdcard+'/Leader_of_History/1.5/Modules/Events.js');
const Module_PlayerList = require(sdcard+'/Leader_of_History/1.5/Modules/PlayerList.js');
const Module_Player = require(sdcard+'/Leader_of_History/1.5/Modules/Player.js');


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName){
var Game = Module_Game.load();
if(Game.room != null && Api.isCompiled(eventBot) && !Api.isCompiling(eventBot)) Api.reload(eventBot);
try{
if(!msg.startsWith("hl") && !msg.startsWith("Hl") && !msg.startsWith("HL") && !msg.startsWith("hL") || room.includes("릴레이")) return;
if(!Api.canReply(sender)){
    replier.reply([
        prefix+"- 안내메시지가 전송될 수 없습니다."+"\u200b".repeat(500),
        "",
        " > 봇이 작동중인 계정의 개인톡으로, 플레이할 오픈프로필로 아무 메시지나 보내서 안내메시지를 전송할 수 있는 환경을 만들어주세요.",
        "(*보안을 위해 오픈프로필을 사용해주세요.)",
        "",
        " > 안 될 경우 : 개인톡으로 메시지를 보낸 프로필과 명령어를 쓰는 프로필이 같은지 확인해주세요. 그래도 안 된다면 한 번 더 시도해주세요."
    ].join("\n"));
    return;
}
const cmd = msg.split(" ");
const code = java.lang.String(imageDB.getProfileImage()).hashCode();
var PlayerList = Module_PlayerList.load();
var Player = Module_Player.load(code);
if(Game.room != null && Game.players.includes(sender) && Player.code != code){
    replier.reply(prefix+"*경고 : 닉네임 도용 시도 감지. 봇 주인에게 알림이 전송되었습니다.");
    Api.replyRoom(adminName,prefix+"- "+sender+"/"+code+"의 닉네임 도용 시도 감지.");
    return;
}
var Events = Module_Event.load();

if(sender=="미러"||sender.startsWith("Author") || sender=="Cheers" || sender=="E. Koinē"){
  if(msg.startsWith("hleval "))try{replier.reply(eval(msg.substr(7).trim()));}catch(e){replier.reply(e+"\n"+e.lineNumber);}
}

if(!["사용","규칙","도움말","게임","직업","정보","배경","투표","시간","프로필","사화","밀회","설파","판결"].includes(cmd[1])){
  if(cmd[0] == "hleval") return;
  replier.reply(prefix+"• 존재하지 않는 명령어입니다. hl 도움말 을 쳐서 게임에 대한 도움말을 확인해보세요.");
  return;
}


if(cmd[1] == "도움말" && cmd.length == 2){
    let help = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/info/도움말.txt');
    replier.reply(prefix+"*도움말을 보려면 클릭하세요."+"\u200b".repeat(500)+"\n\n\n"+help);
    return;
}


if(cmd[1] == "게임"){
    switch(cmd[2]){

        case "생성":
            if(cmd.length != 3)return;
            if(!isGroupChat){
                replier.reply(prefix+"- 단체 채팅방에서 시도해주세요.");
                return;
            }
            if(Game.gaming){
                replier.reply(prefix+"- 이미 게임이 진행중입니다.");
                return;
            } else if(Game.recuiting){
                replier.reply(prefix+"- 이미 모집중인 방이 있습니다.");
                return;
            }
            Game.makeRoom(room,sender,code);
            let manager = Module_Player.makeNew(sender,code,room);
            manager.save();
            PlayerList.add(sender,code);
            Events.add("대기",300);
            Game.announce("역사의 인도자 게임을 생성하였습니다."+"\u200b".repeat(500)+"\n(*시작 필요인원 : 4명)\n\n > 5분 동안 시작하지 않으면 자동으로 삭제됩니다.");
            return;

        case "참가":
            if(cmd.length != 3) return;
            if(!isGroupChat){
                replier.reply(prefix+"- 단체 채팅방에서 시도해주세요.");
                return;
            }
            if(!Game.recuiting && !Game.gaming){
                replier.reply(prefix+"- 방이 존재하지 않습니다.");
                return;
            } else if(room != Game.room){
                replier.reply(prefix+"- 방이 현재 다른 채팅방에 존재합니다.");
                return;
            } else if(Game.gaming){
                replier.reply(prefix+"- 이미 게임이 진행중입니다.");
                return;
            } else if(Game.players.includes(sender) || PlayerList.codes.some(v=>v.code == code)) {
                replier.reply(prefix+"- 이미 참여 중인 닉네임 혹은 프로필입니다.");
                return;
            } else if(Game.players.length >= 12){
                replier.reply(prefix+"- 방이 꽉 찼습니다.");
                return;
            }
            Game.join(sender);
            let player = Module_Player.makeNew(sender,code,room);
            player.save();
            player.hear("system","게임에 참가하였습니다. hl 도움말을 쳐서 다른 명령어들을 확인해보세요.");
            PlayerList.add(sender,code);
            replier.reply(prefix+"• 게임에 참가하였습니다.");
            return;
        
        case "퇴장":
            if(cmd.length != 3) return;
            if(!Game.players.includes(sender)) return;
                if(!isGroupChat){
                replier.reply(prefix+"- 단체 채팅방에서 시도해주세요.");
                return;
            }
            if(Game.gaming) {
              replier.reply(prefix+"- 게임이 시작되어 퇴장할 수 없습니다.");
              return;
            }
            PlayerList.delete(sender);
            replier.reply(prefix+"- 방에서 퇴장하였습니다.");
            if(Game.manager.name == sender){
                if(Game.players.length <= 1){
                    Game.deleteRoom();
                    replier.reply(prefix+"- 남은 인원이 없으므로 방이 사라졌습니다.");
                    return;
                } else {
                    Game.manager.name = ""+Game.players[1];
                    Game.manager.code = PlayerList.codes[0].code;
                    Game.exit(sender);
                    replier.reply(prefix+"- 방장이 퇴장하여 "+Game.players[0]+"에게 방장이 양도되었습니다.");
                    return;
                }
            }
            Game.exit(sender);
            return;

        case "강제퇴장":
            if(cmd.length != 4) return;
            if(sender != Game.manager.name) return;
            if(!isGroupChat){
                replier.reply(prefix+"- 단체 채팅방에서 시도해주세요.");
                return;
            }
            if(isNaN(cmd[3])) {replier.reply(prefix+"- 번호를 입력해주세요."); return;}
            if(parseInt(cmd[3])==1 || Game.players.length < +cmd[3] || parseInt(cmd[3]) <= 0){
                replier.reply(prefix+"- 방에 존재하지 않는 플레이어 번호거나, 자기 자신입니다.");
                return;
            } else if(Game.gaming){
                replier.reply(prefix+"- 이미 게임이 진행중입니다.");
                return;
            }
            let target = Game.players[parseInt(cmd[3])-1];
            PlayerList.delete(target);
            Game.exit(target);
            replier.reply(prefix+"• "+target+"(을)를 게임에서 강제로 퇴장시켰습니다.");
            return;

        case "시작":
            if(cmd.length != 3) return;
            if(sender != Game.manager.name) return;
            if(!isGroupChat){
                replier.reply(prefix+"- 단체 채팅방에서 시도해주세요.");
                return;
            }
            if(Game.gaming){
                replier.reply(prefix+"- 이미 게임이 진행중입니다.");
                return;
            } else if(Game.players.length<4){
                replier.reply(prefix+"- 4인 이상부터 시작 가능합니다.");
                return;
            } else if(Game.players.some(v=>Api.canReply(v)==false)){
                replier.reply(prefix+"- 개인톡으로 안내메세지 전송이 불가능한 플레이어가 있습니다. 확인해주세요.");
                return;
            }
            Game.recuiting = false;
            Game.gaming = true;
            Game.save();
            PlayerList.distributeJobs();
            Events.delete("대기");
            let story = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Story/배경.txt');
            replier.reply(prefix+"• 게임이 시작되었습니다."+"\u200b".repeat(500)+"\n\n\n"+story);
            let process = Events.loadProcess("밤");
            process(Game,PlayerList,Events);
            return;
            
        default:
            if(!Game.recuiting && !Game.gaming) return;
            let left = null;
            if(Events.timers.length>0){
                left = [
                    Events.timers[0].name.replace(/_/g," "),
                    Events.timers[0].end-parseInt(new Date().getTime()/1000)
                ];
            }
            replier.reply([
                prefix+(left==null?"":"*"+(left[0]=="대기"?"방 자동 삭제":left[0])+"까지 "+parseInt(left[1]/60)+"분 "+left[1]%60+"초")+(Game.recuiting?"\n # 게임 참가 가능 #":"")+"\u200b".repeat(500),
                "",
                " -« ~ ♦️ Game ♣️ ~ »-",
                "• 방장 : "+Game.manager.name,
                "• 진행 중인 방 : "+Game.room,
                "• 시간 : "+(Game.isDay?"낮":"밤")+"("+Game.day+"일차)",
                "• 참여 중인 플레이어 :\n"+Game.players.map(function(v,i){
                    return " - "+(i+1)+". "+v+(PlayerList.deads.includes(v)?"(사망)":"");
                }).join("\n"),
                " -« ~ ♥️ Info ♠️ ~ »-"
            ].join("\n"));
            return;
    }
}


if(msg.substr(3).trim() == "직업 목록"){
    let list = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/info/직업 목록.txt');
    replier.reply(prefix+"*직업 목록을 열람하려면 클릭하세요."+"\u200b".repeat(500)+"\n\n\n"+list);
    return;
}

if(cmd[1] == "정보"){
    if(cmd.length != 3){
        replier.reply(prefix+"- hl 정보 (직업명) 의 형식으로 입력해주세요.");
        return;
    }
    let info = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/info/jobs/'+cmd[2]+'.txt');
    replier.reply(prefix+(info === null ? "- 존재하지 않는 직업입니다." : "*"+cmd[2]+"의 정보를 열람하려면 클릭하세요."+"\u200b".repeat(500)+"\n\n"+info));
    return;
}

if(cmd[1] == "배경"){
    if(cmd.length != 3){
        replier.reply(prefix+"- hl 배경 (파벌명) 의 형식으로 입력해주세요.");
        return;
    }
    let info = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Story/'+cmd[2]+'.txt');
    replier.reply(prefix+(info === null ? "- 존재하지 않는 파벌입니다." : "*"+cmd[2]+"의 배경 스토리를 열람하려면 클릭하세요."+"\u200b".repeat(500)+"\n\n\n"+info));
    return;
}

if(cmd[1] == "규칙"){
    if(cmd.length != 3 || isNaN(cmd[2]) || !Number.isInteger(+cmd[2]) || +cmd[2] < 0 || +cmd[2] > 6){ replier.reply(prefix+"- hl 규칙 (0~6) 의 형식으로 입력해주세요."); return; }
    let rules = ["게임 소개","게임 방법","투표","파벌","직업","이벤트","기타"];
    let rule = FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Rules/'+rules[+cmd[2]]+'.txt');
    replier.reply(prefix+"» 규칙 "+cmd[2]+". "+rules[+cmd[2]]+"\u200b".repeat(500)+"\n\n\n"+rule);
}




//여기서부턴 플레이어만 사용 가능
if(Game.players.includes(sender)){


if(cmd[1] == "프로필" && cmd.length == 2 && !isGroupChat){
    let condition = "생존";
    if(!Player.death.alive){
        condition = "사망";
    }
    let bag;
    if(Player.bag.length==0) bag = "텅 빔";
    else if(Player.bag.length>=1) bag = Player.bag.map(v=>v.name+"(×"+v.amount+")");
    let team;
    switch(Player.team){
        case "cretes": team = "크레테스";
        break;
        case "restes": team = "레스테스";
        break;
        case "ormas": team = "오르마스";
        break;
        default: team = "미배정";
    }
    let answer = [
        prefix+"    < "+Player.name+" 의 정보 >"+"\u200b".repeat(500),
        "",
        "🎴 직업Job : "+(Player.job==null?"미배정":Player.job),
        "🚩 팀Team : "+team,
        "🔸 생존 여부 : "+condition,
        "👜 가방 : "+(bag=="텅 빔"?bag:bag.join(", ")),
        "✨ 능력 사용 : "+(Player.ables.useAbility?"가능":"불가능"),
        "🔶 보유 능력 : "+(Player.ability.length==0?"없음":Player.ability.join(", ")),
        "⌛ 로그",
        " > 투표 : "+(Player.log.voteTarget==null?"없음":Player.log.voteTarget),
        " > 능력 : "+(Player.log.abilityName==null?"없음":Player.log.abilityName),
        " > 능력 대상 : "+(Player.log.abilityTarget==null?"없음":Player.log.abilityTarget)
    ].join("\n");
    replier.reply(answer);
    return;
}


if(cmd[1] == "시간"){
    if(!Events.timers.some(v=>v.name=="투표_시작")){
        return;
    } else if(!Player.ables.modifyTime){
        if(!PlayerList.deads.includes(sender)){
            replier.reply(prefix+"- 이미 시간을 증가 혹은 감소시켰습니다.");
        }
        return;
    } else if(!isGroupChat){
        replier.reply(prefix+"- \'"+Game.room+"\' 채팅방에서 시도해주세요.");
        return;
    } else if(cmd.length != 3 || !["증가","감소"].includes(cmd[2])){
        replier.reply(prefix+"- hl 시간 (증가/감소) 의 형식으로 사용해주세요.");
        return;
    }
    let pm = parseInt(160/Math.sqrt(3*Game.players.length));
    cmd[2] == "증가" ? Events.add("투표_시작",pm) : Events.subtract("투표_시작",pm);
    let left = Events.timers.find(v=>v.name=="투표_시작").end - parseInt(new Date().getTime()/1000);
    Player.ables.modifyTime = false;
    Player.save();
    replier.reply(prefix+"• 시간을 "+cmd[2]+"시켰습니다.(투표까지 "+(left>0 ? parseInt(left/60)+"분 "+left%60+"초" : "0분 0초")+")");
    return;
}


if(cmd[1] == "투표"){
    if(!Game.voting){
        replier.reply(prefix+"- 투표 중이 아닙니다.");
        return;
    } else if(isGroupChat) {
        replier.reply(prefix+"- 개인톡에서 사용해주세요.");
        return;
    } else if(cmd.length != 3 || isNaN(cmd[2])){
        replier.reply(prefix+"- hl 투표 (플레이어 번호) 의 형식으로 작성해주세요.");
        return; 
    } else if(+cmd[2] > Game.players.length || +cmd[2] <= 0 ) {
        replier.reply(prefix+"- 없는 플레이어입니다.");
        return;
    } else if(PlayerList.deads.includes(Game.players[+cmd[2]-1])){
        replier.reply(prefix+"- 죽은 플레이어입니다.");
        return;
    } else if(!Player.ables.vote){
        replier.reply(prefix+"- 투표가 불가능한 상태입니다.");
        return;
    }
    let target = Game.players[+cmd[2]-1];
    if(Player.process.voting.length >= 1){
        for(i=0; i<Player.process.voting.length; i++){
            let name = Player.process.voting[i].name;
            if(!java.io.File(sdcard+'/Leader_of_History/1.5/Process/voting').list().map(v=>v).includes(name+'.js')) continue;
            let process = Player.loadProcess("voting",name);
            if(process != false){
                let result = process.isAble(Player);
                if(!result[0]){
                    replier.reply(prefix+"• 투표할 수 없습니다."+"\u200b".repeat(500)+"\n\n\n"+result[1]);
                    return;
                } else {
                    process.func(Game,Player,target);
                }
            }
            Player.subtractProcess("voting",name,1);
        }
    }
    Player.ables.vote = false;
    Player.log.voteTarget = target;
    Player.save();
    replier.reply(prefix+"• "+target+"(을)를 투표하였습니다.");
    
    Game.votes.push(target);
    Game.save();
    Game.announce(Player.name+"(이)가 투표하였습니다.");
    
    if(Game.players.filter(v=>!PlayerList.deads.includes(v)).every(v=>!PlayerList.player(v).ables.vote)){
        Events.subtract("투표_종료",1000);
    }

    return;
}


if(cmd[1] == "판결"){
    if(!Game.inJudgement){
        replier.reply(prefix+"- 판결 중이 아닙니다.");
        return;
    } else if(isGroupChat){
        replier.reply(prefix+"- 개인톡에서 시도해주세요.");
        return;
    } else if(cmd.length != 3 || !["찬성","반대"].includes(cmd[2])) {
        replier.reply(prefix+"- hl 판결 (찬성/반대) 의 형식으로 작성해주세요.");
        return;
    } else if(!Player.ables.vote){
        replier.reply(prefix+"- 이미 판결을 내리셨습니다.");
        return;
    }
    let judge = cmd[2] == "찬성";
    if(Player.process.voting.length >= 1){
        for(i=0; i<Player.process.voting.length; i++){
            let name = Player.process.voting[i].name;
            let process = Player.loadProcess("voting",name);
            if(process != false){
                let result = process.isAble(Player);
                if(!result[0]){
                    replier.reply(prefix+"• 판결을 내릴 수 없습니다."+"\u200b".repeat(500)+"\n\n\n"+result[1]);
                    return;
                } else {
                    process.func(Game,Player,judge);
                }
            }
            Player.subtractProcess("voting",name,1);
        }
    }
    Player.ables.vote = false;
    Player.save();
    replier.reply(prefix+"• "+Game.prisoner+"의 처형에 "+cmd[2]+"하였습니다.");

    Game.judgements.push(judge);
    Game.save();
    return;
}


if(cmd[1] == "사화"){
    if(Player.death.alive || !Player.death.resurgent){
        return;
    } else if(cmd.length < 3){
        replier.reply(prefix+"- hl 사화 (할말) 의 형식으로 사용해주세요.");
        return;
    } else if(isGroupChat){
        replier.reply(prefix+"- 개인톡에서 사용해주세요.");
        return;
    }
    let deads = PlayerList.deads.filter(v=>v!=sender);
    if(PlayerList.jobs.some(v=>v.job == "영매사") && Player.job != "영매사"){
        let listener = PlayerList.jobs.find(v=>v.job == "영매사").name;
        if(!deads.includes(listener)) deads.push(listener);
    }
    deads.forEach(function(v){
        let target = PlayerList.player(v);
        target.hear("(영혼)"+sender,msg.substr(6).trim());
    });
    return;
}


if(cmd[1] == "사용"){
    if(cmd.length != 4 || isNaN(cmd[3])){
        replier.reply(prefix+"- hl 사용 (능력명) (대상의 번호) 로 '개인톡에서' 사용해주세요.");
        return;
    } else if(!Player.ability.includes(cmd[2])){
        replier.reply(prefix+"- 능력 \'"+cmd[2]+"\'(을)를 보유하고 있지 않거나, 특성입니다.");
        return;
    } else if(+cmd[3] < 1 || +cmd[3] > Game.players.length || !Number.isInteger(+cmd[3])){
        replier.reply(prefix+"- 존재하지 않는 플레이어 번호입니다.");
        return;
    } else if(isGroupChat){
        replier.reply(prefix+"- 개인톡에서 사용해주세요.");
        return;
    } else if(!Player.ables.useAbility){
        replier.reply(prefix+"- 현재는 능력 사용이 불가능합니다.");
        return;
    }
    let target = Game.players[+cmd[3]-1];
    replier.reply(prefix+" • "+target+"에게 \'"+cmd[2]+"(을)를 사용하였습니다.");
    Player.useAbility(cmd[2],target);
    return;
}

if(cmd[1] == "밀회"){
    if(!Player.death.alive || !Player.ability.includes("밀회")){
        return;
    } else if(cmd.length < 3){
        replier.reply(prefix+"- hl 밀회 (할말) 의 형식으로 사용해주세요.");
        return;
    } else if(isGroupChat){
        replier.reply(prefix+"- 개인톡에서 사용해주세요.");
        return;
    }
    let restesStarts = Game.players.filter(v=>["암살자","스파이","정보원","건달","테러리스트"].includes(PlayerList.jobs.find(l=>l.name==v).job)).filter(v=>!PlayerList.deads.includes(v)).filter(v=>v!=sender);
    restesStarts.forEach(function(v){
        Api.replyRoom(v,prefix+"> ("+Player.job+")"+sender+" : "+msg.substr(5).trim());
    });
    return;
}

if(cmd[1] == "설파"){
    if(!Player.ability.includes("설파") || !Player.death.alive){
        return;
    } else if(cmd.length < 3){
        replier.reply(prefix+"- hl 설파 (할말) 의 형식으로 사용해주세요.");
        return;
    } else if(isGroupChat){
        replier.reply(prefix+"- 개인톡에서 사용해주세요.");
        return;
    }
    let ormas = PlayerList.teams.ormas.filter(v=>v!=sender);
    if(ormas.length < 1) return;
    ormas.forEach(function(v){
        Api.replyRoom(v,prefix+"> (교주)"+sender+" : "+msg.substr(5).trim());
    });
    return;
}




}







}catch(e){
    Api.replyRoom(adminName,e+"\n"+e.lineNumber);
}


}
//리스폰스 끝


var tip = 0;
const timer = setInterval(function(){
  var Game = Module_Game.load();
  if(Game.gaming){
    if(tip === 120){
      Game.announce("Tip. 명령어가 생각나지 않으신다면 hl 도움말 을 쳐서 명령어를 확인해보세요.");
      tip = 0;
    }
    tip++;
  }
  var PlayerList = Module_PlayerList.load();
  var Events = Module_Event.load();
    if(Events.timers.length<=0) return;
    let now = parseInt(new Date().getTime()/1000);
    if(Events.timers.length >= 1){
        if(Events.timers.some(v=>v.end-30==now)){
            let alarms = Events.timers.filter(v=>v.end-30==now);
            alarms.forEach(v=>Game.announce(v.name=="대기"?"방 자동 삭제까지 앞으로 30초.":v.name.replace("_"," ")+"까지 30초 남았습니다."));
        }
        if(Events.timers.some(v=>v.end-60==now)){
            let alarms = Events.timers.filter(v=>v.end-60==now);
            alarms.forEach(v=>Game.announce(v.name=="대기"?"방 자동 삭제까지 앞으로 1분":v.name.replace("_"," ")+"까지 1분 남았습니다."));
        }
        if(Events.timers.some(v=>v.end<=now)){
            let runs = Events.timers.filter(v=>v.end<=now);
            for(i=0;i<runs.length;i++){
                Events.delete(runs[i].name);
            }
            for(i=0;i<runs.length;i++){
                if(runs.length==0) break;
                if(!java.io.File(sdcard+'/Leader_of_History/1.5/Process/Events').list().map(v=>v).includes(runs[0].name+'.js')){
                    Game.announce("이벤트 "+runs[0].name+"의 프로세스를 찾을 수 없어 실행되지 않습니다.");
                    runs.shift();
                    continue;
                }
                let process = require(sdcard+'/Leader_of_History/1.5/Process/Events/'+runs[0].name+'.js');
                try{
                    process(Game,PlayerList,Events);
                }catch(e){
                    Game.announce("이벤트 오류 발생 : "+e+"\n• 발생 줄 : "+e.lineNumber);
                }finally{
                    Events.delete(runs[0].name);
                    runs.shift();
                }
            }
        }
    }
},1000);


function onStartCompile(){
    clearInterval(timer);
}