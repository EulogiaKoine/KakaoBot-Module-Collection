module.exports = {

    isAble: function(Player,Attacker){
        return [false,[
            "목숨을 위협하는 공격을 당했으나, 철벽같은 수비로 방어에 성공하였습니다."
        ].join("\n")];
    },

    func: function(Player,Attacker){
        Attacker.hear("system",Player.name+"(이)가 철벽같은 수비로 당신의 공격을 방어하였습니다.");
        
        let Game = Player.game();
        Game.announce(Player.name+"(이)가 살해당할 뻔했으나, 강철과도 같은 수비력을 발휘하여 공격을 막아냈습니다.");

        return true;
    }

};