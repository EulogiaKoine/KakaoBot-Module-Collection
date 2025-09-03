module.exports = function(Player){

    if(Player.process.dying.some(v=>v.name=="마술중_사망")){
        Player.deleteProcess("dying","마술중_사망");
    }
    Player.save();
    return true;
};