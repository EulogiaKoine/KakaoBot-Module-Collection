module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.usingAbility.some(v=>v.name=="납치됨")){
            Player.deleteProcess("usingAbility","납치됨");
        }
        if(Player.process.becomingNight.some(v=>v.name=="풀려남")){
            Player.deleteProcess("becomingNight","풀려남");
        }
        Player.save();
        return true;
    }

};