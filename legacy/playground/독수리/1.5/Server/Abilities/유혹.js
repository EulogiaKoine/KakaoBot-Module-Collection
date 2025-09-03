module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"죽은 대상은 유혹할래야 할 수가 없다."];
        } else if(!Player.bag.some(v=>v.name=="의상")){
            return [false,[
                "변장을 위한 의상 하나 없이 유혹을 시도하는 건 위험하다. 할 수 없다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){
        
        Player.hear("system",Target.name+"(을)를 유혹하여 직업을 알아냈습니다. "+Target.name+"의 직업은 \'"+Target.job+"\'입니다.");

        Target.process.observed.forEach(function(v,i){
            let process = Player.loadProcess("observed",v.name);
            if(process == false) return;
            process(Player,Target,"유혹");
            Target.subtractProcess("observed",v.name);
        });

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "유혹";
        Player.save();

        Player.subtractItem("의상",1);

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};