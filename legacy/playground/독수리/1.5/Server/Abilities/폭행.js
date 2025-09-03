module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"시체를 패서 좋을 게 뭐가 있겠어?"];
        } else if(!Player.bag.some(v=>v.name=="너클")){
            return [false,[
                "발각당하지 않게 영업을 하려면 너클이 필요하다."
            ].join("\n")];
        }
        let Target = Player.target(target);
        if(Target.process.voting.some(v=>v.name == "부상")){
            return [false,"같은 상대는 하루에 한 번만, 증거를 남기지 않도록."];
        }
        else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"(을)를 가차없이 폭행하여 정신을 못 차리게 만들었습니다. "+Target.name+"(은)는 공포에 질려 투표를 하지 못할 것입니다. 얼마나 지속될 지는 모르지만......");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "폭행";
        Player.save();

        Player.subtractItem("너클",1);

        Target.hear("???","오늘, 투표할 테면 해보시던가~ 목숨이 아깝지 않다면 말이야. 흐흐흐......");
        Target.hear("system","당신은 극심한 폭행의 트라우마와 공포에 질려 투표의 투 자라도 떠올릴 수 없게 되었습니다.");

        Target.log.user = Player.name;
        Target.addProcess("voting","부상",false,1);
        Target.addProcess("becomingNight","부상_회복",true,1);
        Target.addProcess("dying","부상중_사망",true,1);
        Target.save();

        return true;
    }
    
};