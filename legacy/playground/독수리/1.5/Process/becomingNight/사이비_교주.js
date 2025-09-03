function Process(Player){
    if(Player.game().day%2 != 0) return false;  
    Player.addItem("황금빛 종",1);
    return Player.hear("system",[
        "정신에 간섭하여 강력한 지배력을 행사하는 주술을 종에 담았습니다. 주술의 힘으로 황금빛으로 빛나는 종 하나를 얻었습니다."
    ].join("\n"));
}
module.exports = Process;