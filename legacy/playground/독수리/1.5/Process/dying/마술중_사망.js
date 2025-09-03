module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.becomingDay.some(v=>v.name=="마술함")){
            Player.deleteProcess("becomingDay","마술함");
        }
        Player.save();
        return true;
    }

};