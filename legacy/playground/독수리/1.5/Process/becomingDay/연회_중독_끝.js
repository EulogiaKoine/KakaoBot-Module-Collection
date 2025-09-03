module.exports = function(Player){

    if(Player.process.becomingDay.find(v=>v.name=="연회_중독_끝").count >= 2) return false;

    if(Player.process.voting.some(v=>v.name=="연회_중독")) {
        Player.deleteProcess("voting","연회_중독");
    }
    if(Player.process.dying.some(v=>v.name=="연회_불참")){
        Player.deleteProcess("dying","연회_불참");
    }
    Player.save()
    return true;
    
};