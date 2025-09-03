module.exports = {

    isAble: function(Player,target){

        if(Player.game().isDay){
            return [false,"사람들의 눈에 띄는 낮에는 마술을 준비할 수 없다......"];
        } else if(Player.process.becomingDay.some(v=>v.name=="마술함")){
            return [false,"오늘 밤에는 더이상 할 수 없다."];
        } else if(Player.process.dying.every(v=>v.name!="트릭")){
             return [false,"이미 마술을 한 번 펼쳐 지쳐버렸다……"];
        } else if(target == Player.name){
            return [false,"나 스스로가 마술을 해봤자 속이는 것 하나 없을 거야. 타인에게 시도하자."];
        } else if(Player.playerlist().deads.includes(target)){
            return [false,"이미 죽은 사람이다. 마술에 동원할 수 없어."];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"(을)를 당신 대신 죽을 트릭의 대역으로 지정, 준비를 완료했습니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "트릭";
        Player.addProcess("becomingDay","마술함",true,1);
        Player.addProcess("dying","마술중_사망",true,1);
        Player.save();

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};
