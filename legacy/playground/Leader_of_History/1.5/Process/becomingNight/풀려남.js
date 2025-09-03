module.exports = function(Player){

    if(Player.process.usingAbility.some(v=>v.name=="납치됨")) {
        Player.deleteProcess("usingAbility","납치됨");
    }
    if(Player.process.dying.some(v=>v.name=="납치중_사망")){
        Player.deleteProcess("dying","납치중_사망");
    }
    Player.hear("system","납치에서 풀려났습니다.");
    Player.save()
    return true;
    
};