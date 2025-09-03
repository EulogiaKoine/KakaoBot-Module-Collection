module.exports = {

    isAble: function(Player){
        if(Player.log.abilityTarget == null) return [true,""];
        return [false,"최후의 트릭을 성공시켰습니다. "+Player.log.abilityTarget+"의 모습을 벗어던지자 화려한 이펙트와 함께 당신의 모습이 원래대로 바뀌었습니다."];
    },

    func: function(Game,Player){
        if(Player.log.abilityTarget == null) return false;

        let target = Player.target(Player.log.abilityTarget);

        target.hear(Player.name,"짜잔! 마술쇼를 도와주셔서 감사합니다! 그럼, 그곳에서 편히 쉬시길......");
        target.die("사망하셨습니다.");
        Game.announce("사망한 "+Player.name+"의 의상에서 한순간 연기가 펑 터졌습니다. 연기가 걷힌 후, "+target.name+"의 모습이 드러났습니다.");

        return true;
    }

};