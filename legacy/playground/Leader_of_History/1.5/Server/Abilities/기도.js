module.exports = {

    isAble: function(Player,target){

        if(Player.game().isDay){
            return [false,"언제나 우리의 간구를 들어주시지만...... 내 마음가짐이 부족해. 밤에 집중해서 해야겠어."];
        } else if(Player.process.usingAbility.some(v=>v.name=="기도함")){
            return [false,"더 이상 하면 우리의 사리사욕을 위해 기복하는 꼴이야. 그럴 수는 없어."];
        } else if(!Player.playerlist().deads.includes(target)){
            return [false,"분명 진정으로 필요한 영혼이 있을 거야......"];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"(을)를 위해 기도를...... 고요한 밤의 골목에서 고독한 기도소리와 함께 눈물이 흐르기 시작했습니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "기도";
        Player.addProcess("usingAbility","기도함",false,1);
        Player.save();

        if(!Target.death.resurgent){
            Player.hear(Target.name,"(울먹이지만 밝은 목소리로)저는 괜찮아요. 이미 이곳에서 편히 쉬고있답니다. 돌아가지 않아도 돼요, 감사해요......");
            Player.hear("system",Target.name+"의 부활에 실패하였습니다.");
            return false;
        }

        Target.log.user = Player.name;
        Target.resurrect("기적이 일어났습니다. 당신은 살아났습니다. 낮이 되면 능력을 사용할 수 있게 됩니다.");
        Target.save();

        Player.game().announce(Target.name+"(이)가 기적적으로 깨어났습니다.");

        return true;
    }
    
};