function Event(Game,PlayerList,Events){
    Game.isDay = false;
    Game.inJudgement = false;
    Game.judgements = [];
    Game.announce(Game.day+"일차 밤이 되었습니다. 참가자들께서는 채팅을 줄여주세요.");
    Game.save();

    let alive = Game.players.filter(v=>!PlayerList.deads.includes(v));

    for(let i=0; i<alive.length; i++){
        let Player = Game.player(alive[i]);
        Player.ables.useAbility = true;
        Player.save();
        if(Player.process.becomingNight.length<=0) continue;
        for(let ii=0; ii<Player.process.becomingNight.length; ii++){
            let name = ""+Player.process.becomingNight[ii].name;
            let process = Player.loadProcess("becomingNight",name);
            if(process != false) process(Player);
            Player.subtractProcess("becomingNight",name,1);
        }
        Player.save();
    }

    Events.add("낮",10+(alive.length*5));
    return true;
}
module.exports = Event;
