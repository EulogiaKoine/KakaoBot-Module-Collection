function Process(Player){
    Player.addItem("의상",1);
    return Player.hear("system",[
        "완벽한 변장을 위한 의상이 지급되었습니다."
    ].join("\n"));
}
module.exports = Process;