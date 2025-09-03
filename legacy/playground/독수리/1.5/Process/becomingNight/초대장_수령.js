function Process(Player){
    Player.addProcess("voting","연회_중독",false,1);
    Player.addProcess("becomingDay","연회_중독_끝",true,2);
    Player.save();
    return Player.hear("system",[
        "초대장이 도착했습니다. 다음날 누군가 주최하는 연회에 참가하게 됩니다."
    ].join("\n"));
}
module.exports = Process;