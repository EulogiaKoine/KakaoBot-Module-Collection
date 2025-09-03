module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.log.abilityTarget == null) return false;
        let target = Player.target(Player.log.abilityTarget);
        target.hear("system","거대한 폭발, 테러에 휘말리셨습니다.");
        target.die();
        Game.announce("죽기 직전, 테러리스트 "+Player.name+"가 "+target.name+"(와)과 함께 폭발하였습니다.");

        return true;
    }

};