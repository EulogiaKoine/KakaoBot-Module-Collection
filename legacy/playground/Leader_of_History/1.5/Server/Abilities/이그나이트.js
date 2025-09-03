module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"시체를 파내면서까지 불태울 필요는 없어보인다."];
        } else if(!Player.bag.some(v=>v.name=="현자의 돌")){
            return [false,[
                "이그나이트를 시전하기 위한 현자의 돌이 부족하다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"에게 이그나이트를 시전하였습니다. 현자의 돌이 괄한 황금빛을 내며 불타올라 사라졌습니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "이그나이트";
        Player.save();

        Player.subtractItem("현자의 돌",1);

        Target.log.user = Player.name;
        if(Target.bag.length >= 1){
            let item = Target.bag[parseInt(Math.random()*Target.bag.length-1)].name;
            Target.subtractItem(item,1);
            Target.hear("system","보유하고 있던 물건들 중 "+item+"(이)가 갑자기 빛을 내더니 타오르며 사라졌습니다.("+item+"-1)");
        }
        Target.save();

        return true;
    }
    
};