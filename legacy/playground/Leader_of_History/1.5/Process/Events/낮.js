function Event(Game,PlayerList,Events){

    Game.day++;
    Game.isDay = true;
    Game.announce("아침이 되었습니다. 자유롭게 이야기해주세요.");
    Game.save();

    let alive = Game.players.filter(v => !PlayerList.deads.includes(v));

    alive.forEach(function(v){
        let Player = PlayerList.player(v);
        Player.process.becomingDay.forEach(function(l){
            let process = Player.loadProcess("becomingDay",l.name);
            if(process) process(Player);
            Player.subtractProcess("becomingDay",l.name);
        })
        Player.ables.modifyTime = true;
        Player.ables.useAbility = true;
        Player.save();
    });

    let theEnd = false;

    let cretes = PlayerList.heads.cretes;
    let restes = PlayerList.heads.restes;
    let ormas = PlayerList.heads.ormas;

    if((restes+ormas)*3 <= cretes && alive.every(v=>!["암살자","교주"].includes(PlayerList.jobs.find(l=>l.name==v).job))){
        theEnd = "cretes";
    } else if(cretes+ormas <= restes && alive.every(v=>PlayerList.jobs.find(l=>l.name==v).job!="교주")){
        theEnd = "restes";
    } else if(cretes+restes <= ormas && alive.every(v=>PlayerList.jobs.find(l=>l.name==v).job!="암살자")){
        theEnd = "ormas";
    }

    let ending;
    const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

    switch(theEnd){
        case "cretes":
            ending = [
                "게임이 종료되었습니다! 우승팀은 \'크레테스\'입니다!",
                "",
                " > 우승하신 "+PlayerList.teams.cretes.length+"명의 플레이어들에게 찬사를! 축하드립니다~",
                "",
                " > 모두들, 수고하셨습니다!",
                "",
                "•*¨*• 우승 팀 : 크레테스 •*¨*•",
                PlayerList.teams.cretes.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n"),
                "•*¨*• Congratulations! •*¨*•"+"\u200b".repeat(500),
                "",
                "< 레스테스 >",
                PlayerList.teams.restes.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n")+(PlayerList.teams.ormas.length==0?"":"\n\n< 오르마스 >\n"+PlayerList.teams.ormas.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n")),
                "",
                "",
                "",
                FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Story/크레테스_엔딩.txt')
            ].join("\n");
            break;
        case "restes":
            ending = [
                "게임이 종료되었습니다! 우승팀은 \'레스테스\'입니다!",
                "",
                " > 우승하신 "+PlayerList.teams.restes.length+"명의 플레이어들에게 찬사를! 축하드립니다~",
                "",
                " > 모두들, 수고하셨습니다!",
                "",
                "•*¨*• 우승 팀 : 레스테스 •*¨*•",
                PlayerList.teams.restes.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n"),
                "•*¨*• Congratulations! •*¨*•"+"\u200b".repeat(500),
                "",
                "< 크레테스 >",
                PlayerList.teams.cretes.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n")+(PlayerList.teams.ormas.length==0?"":"\n\n< 오르마스 >\n"+PlayerList.teams.ormas.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n")),
                "",
                "",
                "",
                FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Story/레스테스_엔딩.txt')
            ].join("\n");
            break;
        case "ormas":
            ending = [
                "게임이 종료되었습니다! 우승팀은 \'오르마스\'입니다!",
                "",
                " > 우승하신 "+PlayerList.teams.ormas.length+"명의 플레이어들에게 찬사를! 축하드립니다~",
                "",
                " > 모두들, 수고하셨습니다!",
                "",
                "•*¨*• 우승 팀 : 오르마스 •*¨*•",
                PlayerList.teams.ormas.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n"),
                "•*¨*• Congratulations! •*¨*•"+"\u200b".repeat(500),
                "",
                "< 크레테스 >",
                PlayerList.teams.cretes.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n"),
                "",
                "< 오르마스 >",
                PlayerList.teams.ormas.map(v=>"- "+PlayerList.jobs.find(l=>l.name==v).job+" "+v).join("\n"),
                "",
                "",
                "",
                FileStream.read(sdcard+'/Leader_of_History/1.5/Server/Scripts/Story/오르마스_엔딩.txt')
            ].join("\n");
            break;
    }
    if(ending != undefined){
        Game.announce(ending);
        return Game.deleteRoom();
    }

    Events.add("투표_시작",300);
    return true;
}
module.exports = Event;