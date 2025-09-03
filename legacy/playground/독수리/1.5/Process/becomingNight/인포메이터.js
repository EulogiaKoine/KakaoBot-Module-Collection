module.exports = function(Player){
    Player.addItem("문서",1);
    return Player.hear("system",[
        "원하는 서류상, 물리적 정보를 말소할 수 있는 문서를 하나 준비했습니다. 실시간 갱신 마법과 사용 시 완벽을 기하기 위해 스스로 연소하는 마법이 부여된 특서 문서입니다."
    ].join("\n"));
}