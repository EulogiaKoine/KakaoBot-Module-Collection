module.exports ={

    isAble: function(Player){

        let Game = Player.game();

        if(!(Game.voting || Game.inJudgement)) return [true,""];

        const reason = [
            "\'아, 안돼...... 투표를 하면, 난 또....... 그에게...! 안돼, 안돼. 안돼......\'"
        ].join("\n");
        return [false,reason];
    },

    func: function(Game,Player,target){
        return false;
    }

};