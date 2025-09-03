function Event(Game,PlayerList,Events){

    Game.inJudgement = true;
    Game.announce([
        "최종 판결이 시작되었습니다. 30초 동안 판결이 진행됩니다.",
        "",
        "  +----< 판결 대상 >----+",
        "- "+Game.prisoner,
        "  +---+---<  ~  >---+---+"+"\u200b".repeat(500),
        "",
        "(*개인톡에서 \'hl 판결 찬성or반대\' 를 입력해주세요.)"
    ].join("\n"));
    Game.save();

    let alive = Game.players.filter(v=>!PlayerList.deads.includes(v));
    alive.forEach(v=>{
        let player = Game.player(v);
        player.ables.vote = true;
        player.save();
    });

    Events.add("최종_판결",30);
    return true;
}
module.exports = Event;