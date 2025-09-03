module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){
        if(Player.process.becomingNight.some(v=>v.name=="초대장_수령")) Player.deleteProcess("becomingNight","초대장_수령")
        if(Player.process.voting.some(v=>v.name=="연회_중독")) Player.deleteProcess("voting","연회_중독");
        if(Player.process.becomingDay.some(v=>v.name=="연회_중독_끝")) Player.deleteProcess("becomingDay","연회_중독_끝");
        Player.save();
        return true;
    }

};