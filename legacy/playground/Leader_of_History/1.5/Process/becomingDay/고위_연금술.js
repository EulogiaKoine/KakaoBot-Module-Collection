function Process(Player){

    Player.addItem("현자의 돌",1);
    Player.hear("system","아침햇살을 반사시키는 무지갯빛의 현자의 돌을 연성하였습니다.");
    return true;
}
module.exports = Process;