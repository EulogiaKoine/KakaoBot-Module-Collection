module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"죽은 분들은 그곳에서의 연회를, 산 분들은 산 자들의 연회를."];
        } else if(!Player.bag.some(v=>v.name=="파티 초대장")){
            return [false,[
                "심혈을 기울여 작성한 편지 한 장 없이 연회에 초대할 수는 없어......"
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"을 파티에 초대했습니다. 대상은 다음날 연회에 중독되어 투표할 수 없을 것입니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "초대";
        Player.save();

        Player.subtractItem("파티 초대장",1);

        Target.log.user = Player.name;
        Target.addProcess("becomingNight","초대장_수령",true,1);
        Target.addProcess("dying","연회_불참",true,1);
        Target.save();

        return true;
    }
    
};