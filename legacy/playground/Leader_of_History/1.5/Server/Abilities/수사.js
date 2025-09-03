module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"죽은 대상은 조사할 수가 없다......"];
        } else if(!Player.bag.some(v=>v.name=="수색 영장")){
            return [false,[
                "수사를 하고 싶지만, 수색 영장이 없어 불가능하다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        if(Target.process.observed.length>0){
            for(let i=0; i<Target.process.observed.length; i++){
                let name = Target.process.observed[i].name;
                let process = Player.loadProcess("observed",name);
                if(process == false) continue;
                process(Player,Target,"수사");
                Target.subtractProcess("observed",name);
            }
        }

        let killed = ["암살","광폭","혼신"].includes(Target.log.abilityName) ? "\n\n • "+Target.name+"(이)가 마지막으로 살해를 하였습니다." : "";
        Player.hear("system",Target.name+"(이)가 마지막으로 사용한 능력의 대상은 "+(Target.log.abilityTarget==null?"없습니다.":"\'"+Target.log.abilityTarget+"\' 입니다.")+killed);

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "수사";
        Player.save();

        Player.subtractItem("수색 영장",1);

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};
