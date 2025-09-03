module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(Player.game().isDay){
            return [false,"은밀하게 계획을 실행할 수 있는 밤까지 기다리자......"];
        } else if(PlayerList.deads.includes(target)){
            return [false,"납치해봤자 시체를 어차피 할 수 있는 게 없다."];
        } else if(!Player.bag.some(v=>v.name=="너클") || Player.bag.find(v=>v.name=="너클").amount < 3){
            return [false,[
                "고난도의 작업을 위해서는 너클이 최소 3개는 필요하다. 지금은 실행할 수 없다."
            ].join("\n")];
        }
        let Target = Player.target(target);
        if(Target.process.usingAbility.some(v=>v.name == "납치됨")){
            return [false,"이미 납치한 상대다."];
        }
        else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"(을)를 납치하는 데에 성공하였습니다. 설령 왕실의 기사단장이라도 이 은밀한 작업을 피해갈 수는 없었을 겁니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "납치";
        Player.save();

        Player.subtractItem("너클",3);

        Target.hear("system","당신은 부지불식간에 당신을 감싼 포대 안에서 묶여 이러지도 저러지도 못하는 상태가 되었습니다. 납치당하였습니다.");

        Target.log.user = Player.name;
        Target.addProcess("usingAbility","납치됨",false,1);
        Target.addProcess("becomingNight","풀려남",true,1);
        Target.addProcess("dying","납치중_사망",true,1);
        Target.save();

        return true;
    }
    
};