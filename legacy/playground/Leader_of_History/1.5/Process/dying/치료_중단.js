module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.beUnderAttack.some(v=>v.name=="치료")) Player.deleteProcess("beUnderAttack","치료");
        if(Player.process.becomingDay.some(v=>v.name=="치료_중단")) Player.deleteProcess("becomingDay","치료_중단");
        Player.save();
        return true;
    }

};