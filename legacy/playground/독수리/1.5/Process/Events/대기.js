function Event(Game,PlayerList){
    if(Game.gaming) return false;
    Game.announce("대기시간을 초과하여 방이 사라졌습니다.");
    return Game.deleteRoom();
}
module.exports = Event;