module.exports = function(Player){

    if(Player.process.dying.some(v=>v.name=="위령하다_사망")){
        Player.deleteProcess("dying","위령하다_사망");
    }
    Player.save();
    return true;
};