function Process(Player){

    Player.addItem("파티 초대장",1);
    Player.hear("system","파티 초대장을 작성하였습니다.");
    return true;
}
module.exports = Process;