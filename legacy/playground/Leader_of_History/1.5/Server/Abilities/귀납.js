module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"죽은 대상은 조사할 수가 없다......"];
        } else if(!Player.bag.some(v=>v.name=="수사권")){
            return [false,[
                "귀납에 필요한 증거 자료를 조사하기 위하여 수사권이 필요하다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        if(Target.process.observed.length>0){
            for(let i=0; i<Target.process.observed.length; i++){
                let name = Target.process.observed[i].name;
                let process = Player.loadProcess("observed",name);
                if(process == false) continue;
                process(Player,Target,"귀납");
                Target.subtractProcess("observed",name);
            }
        }

        Player.hear("system",Target.name+"에게 마지막으로 능력을 사용한 사람은 "+(Target.log.user==undefined?"없습니다.":Target.log.user+"입니다."));

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "귀납";
        Player.save();

        Player.subtractItem("수사권",1);

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};