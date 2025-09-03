module.exports = {

    isAble: function(Player,target){
        
        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"이미 사망한 사람이다. 치료할 수 없다."];
        } else return [true,""];
    },

    func: function(Player,Target){

        Target.addProcess("beUnderAttack","치료",true,1);
        Target.addProcess("becomingDay","치료_중단",true,1);
        Target.addProcess("dying","치료_중단",true,1);
        Target.log.user = Player.name;
        Target.save();

        Player.addProcess("usingAbility","치료중",false,1)
        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "주치의";
        Player.save();

        Player.hear("system",Target.name+"의 치료를 금일 밤까지 전담하는 일일 주치의가 되었습니다.");
        return true;
    }

};