module.exports = {

    isAble: function(Player){
        return [true,""];
    },

    func: function(Game,Player){

        let PlayerList = Player.playerlist();
        if(PlayerList.jobs.every(v=>v.job!="계승자")) return false;

        let successor = PlayerList.jobs.find(v=>v.job == "계승자").name;
        if(PlayerList.deads.includes(successor)) return false;

        let succeeding = [Player.job,Player.team];

        Player.hear("system","죽기 직전, 당신의 계승자가 당신의 직업, 소속 파벌을 계승하였습니다.");
        PlayerList.moveTeam(Player.name,"unassigned");
        Player.getJob("잉여");
        PlayerList.moveTeam(Player.name,succeeding[1]);
        PlayerList.jobs.find(v=>v.name == Successor.name).job = "잉여";
        Player.hear("system","직업이 \"잉여\"가 되었습니다.");

        let Successor = PlayerList.player(successor);
        PlayerList.moveTeam(Successor.name,"unassigned");
        Successor.getJob(succeeding[0]);
        PlayerList.moveTeam(Successor.name,succeeding[1]);
        PlayerList.jobs.find(v=>v.name == Successor.name).job = succeeding[0];
        Successor.hear("system",Player.name+"(을)를 완전히 계승하였습니다.");

        PlayerList.save();

        return true;
    }

};