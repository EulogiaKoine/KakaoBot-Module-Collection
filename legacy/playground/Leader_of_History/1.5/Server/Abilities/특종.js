module.exports = {

    isAble: function(Player,target){

        let PlayerList = Player.playerlist();

        if(PlayerList.deads.includes(target)){
            return [false,"죽은 사람에 대한 기사는 수집하지 못했다. 특종을 터뜨릴 수 없다."];
        } else if(!Player.bag.some(v=>v.name=="기사 초고")){
            return [false,[
                "특종을 터뜨리고 싶어도 특종감을 수집하지 못한 상태이다."
            ].join("\n")];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "특종";
        Player.save();

        Player.subtractItem("기사 초고",1);

        Target.log.user = Player.name;
        Target.addProcess("becomingDay","특종",true,1);
        Target.addProcess("dying","취재중_사망",true,1);
        Target.save();

        return true;
    }
    
};