module.exports = {

    isAble: function(Player,Attacker){
        return [false,[
            "죽음에 이르는 공격을 받았으나, 당신을 전담하던 의원의 혼을 다한 치료 덕에 살아날 수 있었습니다."
        ].join("\n")];
    },

    func: function(Player,Attacker){
        Attacker.hear("system",Player.name+"(을)를 완전히 죽이는 데에 실패하였습니다.");
        
        let Game = Player.game();
        Game.announce(Player.name+"(이)가 죽음에 이르는 공격을 받았으나, 그를 전담하던 의원의 혼을 다한 치료 덕에 살아날 수 있었습니다.");

        return true;
    }

};