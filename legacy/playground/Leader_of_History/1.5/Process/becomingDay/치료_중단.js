module.exports = function(Player){

    if(Player.process.beUnderAttack.some(v=>v.name=="치료")){
        Player.deleteProcess("beUnderAttack","치료");
    }
    if(Player.process.dying.some(v=>v.name=="치료_중단")){
        Player.deleteProcess("dying","치료_중단");
    }
    Player.save();
    return true;
};