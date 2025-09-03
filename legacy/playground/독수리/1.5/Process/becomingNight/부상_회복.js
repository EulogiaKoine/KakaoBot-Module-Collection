module.exports = function(Player){

    if(Player.process.voting.some(v=>v.name=="부상")) {
        Player.deleteProcess("voting","부상");
    }
    if(Player.process.dying.some(v=>v.name=="부상중_사망")){
        Player.deleteProcess("dying","부상중_사망");
    }
    Player.save()
    return true;
    
};