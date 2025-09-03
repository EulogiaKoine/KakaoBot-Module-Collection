module.exports = {

    isAble: function(Player,target){

        if(Player.playerlist().deads.includes(target)){
            return [false,"이미 죽은 사람의 직업은 계승할 수 없습니다."];
        } else if(target == Player.name){
            return [false,"자기 자신을 계승할 수는 없는 노릇이다."];
        } else if(Player.process.usingAbility.some(v=>v.name=="계승_준비됨")){
            return [false,"이미 계승할 대상을 지정한 상태입니다."];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"의 계승자가 되었습니다. 대상이 사망할 경우 직업과 팀을 물려받게 됩니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "계승";
        Player.addProcess("usingAbility","계승_준비됨",false,1);
        Player.save();

        Target.log.user = Player.name;
        Target.addProcess("dying","계승",true,1);
        Target.save();

        return true;
    }
    
};