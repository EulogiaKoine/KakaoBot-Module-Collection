module.exports = {

    isAble: function(Player,target){

        if(target == Player.name){
            return [false,"자신의 목숨을 헛되이 버릴 셈이냐? 나에겐 할 수 없어."];
        } else if(Player.playerlist().deads.includes(target)){
            return [false,"시체를 죽이는 건 대업에 안 맞아."];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system","\'크, 크크큭...... 그래, 같이 죽는거다...... 위대한 혁명을 위하여.\'");
        Player.hear("system",Target.name+"(을)를 당신과 함께 죽을 대업의 희생양으로 정하고 테러를 준비했습니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "테러";
        Player.save();

        Target.log.user = Player.name;
        Target.save();

        return true;
    }
    
};