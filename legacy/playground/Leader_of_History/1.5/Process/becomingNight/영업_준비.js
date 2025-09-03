function Process(Player){
    Player.addItem("너클",1);
    return Player.hear("system",[
        "깨끗한 새 너클을 벼려 준비했습니다."
    ].join("\n"));
}
module.exports = Process;