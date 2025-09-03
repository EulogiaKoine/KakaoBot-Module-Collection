module.exports = function(_, rspire){
inspire('syntax.inherits')
const { Team } = rspire('Team')

function LOHTeam(){
    Team.call(this)
    this.init()
}
inherits(LOHTeam, Team)

LOHTeam.Deciders = {
    cretes(players){
        players = players.filter(v => v.player.isAlive())
        let c = 0, job
        for(let { team, player } of players){
            if(team === "크레테스")
                c++
            else if((job = player.getJob()) === "암살자" || job === "교주")
                return false
        }
        return c / players.length >= 0.75
    },

    restes(players){
        players = players.filter(v => v.player.isAlive())
        let c = 0, job
        for(let { team, player } of players){
            if(team === "레스테스")
                c++
            else if(job = player.getJob() === "교주")
                return false
        }
        return c / players.length >= 0.5
    },

    ormas(players){
        players = players.filter(v => v.player.isAlive())
        let c = 0, job
        for(let { team, player } of players){
            if(team === "오르마스")
                c++
            else if(job = player.getJob() === "암살자")
                return false
        }
        return c / players.length >= 0.5  
    }
}

LOHTeam.prototype.init = function(){
    const D = LOHTeam.Deciders
    this.initTeam("크레테스", D.cretes)
    this.initTeam("레스테스", D.restes)
    this.initTeam("오르마스", D.ormas)
}


return { LOHTeam: LOHTeam }
}