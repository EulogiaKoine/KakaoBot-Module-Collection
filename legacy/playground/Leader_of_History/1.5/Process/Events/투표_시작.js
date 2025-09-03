function Event(Game,PlayerList,Events){

    Game.voting = true;
    Game.announce([
        "투표 시간이 되었습니다. 40초 동안 투표가 진행됩니다. 신중히 투표해주세요.",
        "",
        "  +----< 플레이어Players >----+",
        Game.players.map(function(v,i){
            return "- "+(i+1)+". "+v+(PlayerList.deads.includes(v)?"(사망)":"");
        }).join("\n"),
        "  +-----+-----< ~ >-----+-----+"+"\u200b".repeat(500),
        "",
        "(*개인톡에서 \'hl 투표 (번호)\' 를 입력해주세요.)"
    ].join("\n"));
    Game.save();

    let alive = Game.players.filter(v=>!PlayerList.deads.includes(v))
    const msg = "'hl 투표 (플레이어 번호) 로 투표하실 수 있습니다."
        + "\n\n" + Game.players.map((v, i) => (i+1) + ". " + v).join('\n')
    alive.forEach(v=>{  
        let player = PlayerList.player(v);
        player.ables.vote = true;
        player.ables.useAbility = false;
        player.ables.modifyTime = false;
        player.hear("system", msg)
        player.save();
    });

    Events.add("투표_종료",40);
    return true;
}
module.exports = Event;
