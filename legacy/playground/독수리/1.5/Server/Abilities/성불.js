module.exports = {

    isAble: function(Player,target){

        if(Player.game().isDay){
            return [false,"위령할 분위기가 안 난다. 달이 뜬 어두컴컴한 밤에 다시 시도하자."];
        } else if(Player.process.becomingDay.some(v=>v.name=="위령하다_지침")){
            return [false,"지쳐서 오늘 밤은 더 못하겠다......"];
        } else if(!Player.playerlist().deads.includes(target)){
            return [false,"산 사람의 영혼을 위령할 순 없어!"];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",Target.name+"의 생전 직업은 "+Target.job+"입니다.");

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "성불";
        Player.addProcess("becomingDay","위령하다_지침",true,1);
        Player.addProcess("dying","위령하다_사망",true,1);
        Player.save();

        Target.log.user = Player.name;
        Target.hear("system","영매의 극진한 위령을 받아 이승의 미련을 모두 버리고 성불되었습니다");
        Target.death.resurgent = false;
        Target.save();

        return true;
    }
    
};