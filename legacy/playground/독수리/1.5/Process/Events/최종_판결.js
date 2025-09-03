function Event(Game,PlayerList,Events){

    Game.inJudgement = false;
    Game.save();

    switch(Game.judgements.filter(v=>v==true).length > parseInt(Game.judgements.length/2)){
        case true:

            let prisoner = PlayerList.player(Game.prisoner);
            let dies = true;

            if(prisoner.process.voting.length > 0){
                for(i=0; i<prisoner.process.voting.length; i++){
                    let name = prisoner.process.voting[i].name;
                    let process = prisoner.loadProcess("voting",name);
                    if(process == false) continue;
                    let result = process.isAble(prisoner);
                    if(!result[0]) {
                        dies = false;
                        Game.announce([
                            "과반수가 찬성하였으나, 최종 판결의 집행이 취소되었습니다.",
                            "",
                            "  +----< 처형 대상자 >----+",
                            "- "+prisoner.name+"(은)는 처형되지 않았습니다.",
                            "  +----+----< ~ >----+----+"+"\u200b".repeat(500),
                            "",
                            "",
                            result[1]
                        ].join("\n"));
                        process.func(prisoner);
                    }
                    prisoner.subtractProcess("voting",name,1);
                }
            }

            if(dies){
                prisoner.die("투표로 인해 처형되었습니다.");
                Game.announce([
                    "최종 판결이 집행되었습니다.",
                    "",
                    "  +----< 처형 대상자 >----+",
                    "- "+Game.prisoner+"가 처형되었습니다.",
                    "  +----+----< ~ >----+----+"
                ].join("\n"));
            }

            break;

        default:
            Game.announce("찬성이 과반수를 넘지 못하여 "+Game.prisoner+"(은)는 처형되지 않았습니다.");
    }

    Game.prisoner = null;
    Game.judgements = [];
    Game.save();

    let night = Events.loadProcess("밤");
    let playerlist = Game.playerlist();
    night(Game,playerlist,Events);

    return true;
}
module.exports = Event;