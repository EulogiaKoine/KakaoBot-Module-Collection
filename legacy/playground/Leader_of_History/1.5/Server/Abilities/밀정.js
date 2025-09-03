module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"시체에게서 내가 건져낼 수 있는 정보는 없어......"];
        } else if(!Player.bag.some(v=>v.name=="의상") || Player.bag.find(v=>v.name=="의상").amount < 2){
            return [false,[
                "어려운 작업을 수행해야 한다. 기본 의상 하나에 더해 예비 의상까지, 최소 2개가 필요하다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        let team;
        switch(Target.team){
            case "cretes": team = "크레테스"; break;
            case "restes": team = "레스테스"; break;
            case "ormas": team = "오르마스"; break;
            default: team = "무소속";
        }
        
        Player.hear("system",Target.name+"의 주위에서 생활하고, 함께 지내며 신뢰를 쌓아 마침내 "+Target.name+"(이)가 속한 파벌이 \'"+team+"\'(이)라는 것을 실토하게 만들었습니다.");

        Target.process.observed.forEach(function(v,i){
            let process = Player.loadProcess("observed",v.name);
            if(process == false) return;
            process(Player,Target,"밀정");
            Target.subtractProcess("observed",v.name);
        });

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "밀정";
        Player.save();

        Player.subtractItem("의상",2);

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};