module.exports = function(Player){

    if(Player.process.usingAbility.some(v=>v.name=="치료중")) {
        Player.deleteProcess("usingAbility","치료중");
        Player.save();
        Player.hear("system","전담 중이던 플레이어의 치료를 종료하였습니다. 주치의로서 전담 대상을 다시 선택할 수 있습니다.");
        return true;
    }

};