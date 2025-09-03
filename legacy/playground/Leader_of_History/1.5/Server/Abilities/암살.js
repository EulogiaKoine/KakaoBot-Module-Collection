module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"이미 죽은 상대다. 다시 죽일 필요는 없어보인다."];
        } else if(!Player.bag.some(v=>v.name=="단도")){
            return [false,[
                "단도가 부족하다...... 밤까지 기다려보자."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "암살";
        Player.save();

        let PlayerList = Player.playerlist();
        let murderers = PlayerList.teams.restes.filter(v=>PlayerList.jobs.find(l=>l.name==v).job=="암살자");

        murderers.forEach(function(v){
            let murderer = PlayerList.player(v);
            if(!murderer.bag.some(l=>l.name=="단도")) return;
            murderer.subtractItem("단도",1);
            if(v!=Player.name) murderer.hear("system","다른 암살자가 암살을 시도하여 연결된 단도 하나가 사라졌습니다.");
        });

        Player.hear("system",Target.name+" 암살을 시도했습니다.");

        Target.log.user = Player.name;
        Target.attacked(Player,"암살당했습니다.");
        Target.save();

        
        return true;
    }
    
};