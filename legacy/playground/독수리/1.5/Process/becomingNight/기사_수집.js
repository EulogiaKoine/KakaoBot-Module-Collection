function Process(Player){
    if(Player.process.becomingNight.find(v=>v.name=="기사_수집").count >= 2) return false;
    Player.addItem("기사 초고",1);
    return Player.hear("system",[
        "수집한 기삿거리들로 기사 초고를 작성하였습니다. 초고를 사용하여 단 한 번의 기회를 노려 특종을 터뜨릴 수 있습니다."
    ].join("\n"));
}
module.exports = Process;