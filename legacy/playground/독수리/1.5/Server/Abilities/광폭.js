module.exports = {

    isAble: function(Player,target){

        if(Player.playerlist().deads.includes(target)){
            return [false,"시체를 상대로 광분할 필요는 없다!"];
        } else if(Player.process.usingAbility.some(v=>v.name=="광폭_후유증")){
            return [false,[
                "의지와 달리 몸이 따라주지 않아 불가능하다......"
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "광폭";
        Player.addProcess("usingAbility","광폭_후유증",false,1);
        Player.hear("system",Target.name+"(을)를 에게 광분하여 달려든 뒤, 그의 심장을 향해 바짝 세운 검날을 들이댔습니다. 머리끝까지 올라온 희열에 광소가 터져나왔습니다.");

        Target.log.user = Player.name;
        Target.attacked(Player,"당신은 살해당했습니다. 미치광이처럼 달려온 누군가의 붉은 눈빛을 마지막으로 보며......");
        Target.save();
        
        return true;
    }
    
};