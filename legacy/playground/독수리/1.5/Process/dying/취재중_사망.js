module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.becomingDay.some(v=>v.name=="특종")) Player.deleteProcess("becomingDay","특종");
        Player.save();
        return true;
    }

};