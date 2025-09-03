module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.voting.some(v=>v.name=="부상")){
            Player.deleteProcess("voting","부상");
        }
        if(Player.process.becomingNight.some(v=>v.name=="부상_회복")){
            Player.deleteProcess("becomingNight","부상_회복");
        }
        Player.save();
        return true;
    }

};