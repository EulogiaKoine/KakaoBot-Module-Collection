module.exports = {

    isAble: function(Player,target){

        if(Player.playerlist().deads.includes(target)){
            return [false,"시체를 상대로 광분할 필요는 없다!"];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "혼신";
        Player.die(Target.name+"에게 혼신의 각오로 온몸을 던졌습니다. 신경이 손상되고, 근육이 파열되는 극심한 고통에 눈이 뒤집혔지만 당신은 멈추지 않았습니다. 결과를 보지 못한 채, 당신은 그를 찌를 감촉을 느끼며 사망했습니다.");

        Target.log.user = Player.name;
        Target.attacked(Player,"당신은 살해당했습니다. 미치광이처럼 달려온 누군가의 붉은 눈빛을 마지막으로 보며......");
        Target.save();
        
        return true;
    }
    
};