function Process(Player){

    Player.addItem("수사권",1);
    Player.hear("system","수사권이 지급되었습니다.");
    return true;
}
module.exports = Process;