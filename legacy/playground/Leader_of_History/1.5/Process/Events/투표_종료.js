function Event(Game,PlayerList,Events){

    function overlaps(arr){
        let result = [];
        arr.forEach(v=>{
            if(!result.some(l=>l.name==v)){
                let input = {name: v, num: 1};
                result.push(input);
            } else result.find(l=>l.name==v).num++;
        });
        return result;
    }

    let votes = overlaps(Game.votes);
    let prisoner = votes.find(v=>v.num > parseInt(Game.votes.length/2));
    let none = true;
    if(prisoner != undefined){
        none = false;
        prisoner = prisoner.name;
    }

    Game.voting = false;
    Game.votes = [];
    Game.announce("투표가 종료되었습니다.");
    Game.save();

    switch(none){
        case true:
            Game.announce("과반수를 받은 사람이 없어 처형 대상은 정해지지 않았습니다.");
            let night = Events.loadProcess("밤");
            night(Game,PlayerList,Events);
            return;
        default:
            Game.announce(prisoner+"(이)가 과반수를 받아 처형대 위에 올라갑니다. 최후의 반론을 위한 시간이 20초 주어집니다.");
            Game.prisoner = prisoner;
            Game.save();
            Events.add("찬반_투표",20);
    }

}
module.exports = Event;