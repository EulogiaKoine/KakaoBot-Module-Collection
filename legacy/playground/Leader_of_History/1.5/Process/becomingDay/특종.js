module.exports = function(Player){
    if(Player.process.dying.some(v=>v.name=="취재중_사망")) {
        Player.deleteProcess("dying","취재중_사망");
        Player.save();
    }
    Player.game().announce("호외요, 호외! 지금 막 들어온 따끈따끈한 특종입니다! "+Player.name+"의 직업이 "+Player.job+"(이)라고 합니다!");
    return true;
};