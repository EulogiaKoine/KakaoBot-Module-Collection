module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player,target){
        if(Game.voting){
            Game.votes.push(target);
            Game.save();
            Player.hear("system","당신의 탁월한 정치 수완으로 상상할 수 있는 모든 방법을 동원하여, 당신이 투표한 "+target+"(은)는 한 표를 더 얻었습니다.");
        } else if(Game.inJudgement){
            Game.judgements.push(target);
            Game.save();
            Player.hear("system","당신의 탁월한 정치 수완으로 상상할 수 있는 모든 방법을 동원하여, 당신의 표가 두 명 분으로 받아들여졌습니다.");
        }
    }

};