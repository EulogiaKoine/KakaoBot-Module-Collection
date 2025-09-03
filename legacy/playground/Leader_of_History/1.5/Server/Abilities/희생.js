module.exports = {

    isAble: function(Player,target){

        if(Player.game().isDay){
            return [false,"언제나 우리의 간구를 들어주시지만...... 내 마음가짐이 부족해. 밤에 집중해서 해야겠어."];
        } else if(!Player.playerlist().deads.includes(target)){
            return [false,"분명 진정으로 필요한 영혼이 있을 거야......"];
        } else return [true,""];
        
    },

    func: function(Player,Target){

        Player.hear("system",[
            Target.name+"를 위해 기도를 시작했습니다."+"\u200b".repeat(500),
            "",
            "",
            "\".......주여.\"",
            "",
            " 우리를 사랑하시어, 가장 높은 곳에서 낮은 곳으로 내려와 우릴 위해 죽으신 주여.",
            "",
            "\"간구드리옵니다. 제발, 제발......\"",
            "",
            " 주의 자녀를 긍휼히 여기사, 그의 영혼을 상처입힌 칼을 제게 대신 꽂아주세요.",
            "",
            "\"주 없인 아무것도 할 수 없는 연약한 종이 간구드립니다.\"",
            "",
            " 주여.",
            "",
            ""
        ].join("\n"));

        Player.log.abilityTarget = Target.name;
        Player.log.abilityName = "희생";

        if(!Target.death.resurgent){
            Player.hear(Target.name,"(울먹이지만 밝은 목소리로)저는 괜찮아요. 이미 이곳에서 편히 쉬고있답니다. 돌아가지 않아도 돼요, 감사해요......");
            Player.hear("system",Target.name+"의 부활에 실패하였습니다.");
            Player.save();
            return false;
        }

        Player.die("당신을 껴안는 포근한 무형의 손길과 함께 폭포수처럼 황금빛 눈물이 쏟아져 내렸습니다. 당신은 약속된 사랑의 세계를 받아들이며 조용히 웃었고, 눈을 감았습니다.");
        Player.death.resurgent = false;
        Player.save();

        Target.log.user = Player.name;
        Target.resurrect("기적이 일어났습니다. 당신은 살아났습니다. 그러나, 정신을 차린 당신의 곁엔 두 손을 꼭 모은 채 기도하는 성녀가 있었습니다. 그녀는 숨을 쉬고 있지 않았지만, 행복한 표정이었습니다.");
        Target.save();

        Player.game().announce(Target.name+"(이)가 기적적으로 깨어났습니다. 깨어난 그의 곁에선 잔잔하지만 누구보다 밝은 미소로 눈을 감은 성녀가 앉아있었습니다."+"\u200b".repeat(500)+"\n(*낮이 되면 능력 사용이 가능합니다.)");

        return true;
    }
    
};