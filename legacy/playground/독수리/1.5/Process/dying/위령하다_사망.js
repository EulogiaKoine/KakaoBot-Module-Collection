module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.becomingDay.some(v=>v.name=="위령하다_지침")){
            Player.deleteProcess("becomingDay","위령하다_지침");
        }
        Player.save();
        return true;
    }

};