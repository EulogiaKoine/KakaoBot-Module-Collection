module.exports = {

    isAble: function(Player,target){

        if(!Player.bag.some(v=>v.name=="문서")){
            return [false,[
                "......증거 말소에 필요한 정보를 담은 문서가 부족하다."
            ].join("\n")];
        } else if(Player.game().isDay){
            return [false,"은밀함이 생명이다. 밤에 움직여야 해."];
        } else return [true,""];
        
    },

    func: function(Player,Target){
        
        Player.hear("system",Target.name+"의 능력 사용 기록을 모두 말소시켰습니다.");
        Player.subtractItem("문서",1);

        Target.log.abilityTarget = null;
        Target.log.abilityName = null;
        let announce;
        switch(Target.log.abilityName){
            case "트릭":
                announce = "누군가에 의해 준비한 마술이 취소되었습니다. 대상과 사용 기록이 초기화되었습니다.";
                break;
            case "테러":
                announce = "누군가에 의해 준비한 테러가 무산되었습니다. 대상과 사용 기록이 초기화되었습니다.";
                break;
            default:
                announce = "누군가에 의해 정보가 말소되었습니다. 능력 사용 정보가 초기화되었습니다."
        }
        Target.hear("system",announce);
        Target.save();

        return true;
    }
    
};