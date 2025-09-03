module.exports = function(Observer,Player,ability){

    if(!["유혹","밀정"].includes(ability)) return false;


    let toObserver, toPlayer;

    switch(ability){
        case "유혹":
            toObserver = [
                "유혹 대상에게 정체를 발각당했습니다."+"\u200b".repeat(500),
                "",
                "",
                " 당신은 귀재의 수준에 오른 변장술로 의상을 준비하고, "+Player.name+"(을)를 유혹하려 접근. 정보를 빼내는 데에 성공하였습니다.",
                "",
                " 하지만 정보를 얻어낸 뒤 빠져나가려고 몸을 빼내는 순간, 매의 눈으로 주변을 순찰하던 그에게 발각당했고, 당신을 알아본 그에 의해 정체를 발각당한 채 돌아올 수밖에 없었습니다.",
                "",
                ""
            ].join("\n");
            toPlayer = [
                ""+Observer.name+"(이)가 당신에게서 정보를 빼내려 시도하였습니다. 순찰 도중 빠져나가려는 스파이의 정체를 간파하였습니다."
            ].join("\n");
            break;
        case "밀정":
            toObserver = [
                "밀정으로 활동하던 도중 "+Player.name+"에게 정체를 발각당했습니다."+"\u200b".repeat(500),
                "",
                "",
                " 당신은 귀재의 수준에 오른 변장술로 의상을 준비하고, "+Player.name+"의 정보를 빼내기 위해 고도의 수를 써가며 정보를 빼내는 데에 성공하였습니다.",
                "",
                " 하지만 정보를 얻어낸 뒤 빠져나가려고 몸을 빼내는 순간, 매의 눈으로 주변을 순찰하던 그에게 발각당했고, 당신을 알아본 그에 의해 정체를 발각당한 채 돌아올 수밖에 없었습니다.",
                "",
                ""
            ].join("\n");
            toPlayer = [
                ""+Observer.name+"(이)가 당신에게서 정보를 빼내려 시도하였습니다. 순찰 도중 빠져나가려는 스파이의 정체를 간파하였습니다."
            ].join("\n");
    }

    Observer.hear("system",toObserver);
    Player.hear("system",toPlayer);

    return true;
};