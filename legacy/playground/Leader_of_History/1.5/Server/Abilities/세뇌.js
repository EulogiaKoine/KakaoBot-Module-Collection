module.exports = {

 

    isAble: function(Player,target){

 

        if(Player.playerlist().deads.includes(target)){

            return [false,"쯧쯧, 불쌍한 것. 죽어서 이 진리를 깨닫지 못하다니. 딱하기도 해라......"];

        } else if(!Player.bag.some(v=>v.name=="황금빛 종")){

            return [false,[

                "종이 없으면 세뇌에 제대로 걸리지 않을 확률이 매우 높다. 위험을 감수할 순 없구나. 다음을 기약하지."

            ].join("\n")];

        } else if(Player.playerlist().teams.ormas.includes(target)){

            return [false,"이미 우리의 형제이며, 자매이다."];

        } else return [true,""];

        

    },

 

    func: function(Player,Target){

 

        if(Target.process.observed.some(v=>v.name == "빛의_신념")){

            Player.hear("system",Target.name+"의 세뇌의 실패하였습니다. 빛의 신념이 종소리를 무력화시켰습니다!");

            Player.log.abilityTarget = Target.name;

            Player.log.abilityName = "세뇌";

            Player.save();

            Player.subtractItem("황금빛 종",1);

            Target.log.user = Player.name;

            Target.save();

            Target.hear("system","빛의 신념으로 "+Player.name+"의 세뇌를 물리쳤습니다!");

            return false;

        }

 

        Player.hear("system",Target.name+"(을)를 세뇌하였습니다. 오르마스 팀원이 되었습니다. hl 설파 를 사용하여 신자들에게 말을 전하세요.");
        Player.hear("system",Target.name+"의 직업은 \'"+Target.job+"\'입니다.");

 

        Player.log.abilityTarget = Target.name;

        Player.log.abilityName = "세뇌";

        Player.save();

 

        Player.subtractItem("황금빛 종",1);

 

        Target.log.user = Player.name;

        Target.save();

 

        Target.playerlist().moveTeam(Target.name,"ormas");

        Target.hear("교주에게 세뇌되었습니다. 당신은 오르마스 팀이 되었습니다.");

 

        Player.game().announce("종소리가 울려퍼졌습니다. 진원지가 어디인지 알 수 없지만, 정신을 순간이지만 뒤흔듯 듯한 몽환적인 종소리였습니다.");

 

        return true;

    }

    

};

 

