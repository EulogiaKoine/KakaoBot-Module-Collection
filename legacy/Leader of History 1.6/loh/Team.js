module.exports = (function(){

/** @type {./Player} */

function Team(){
    this.$teams = {} /** @type {{teamName: decider($players)}} */
    this.$players = [] /** @type {{team: string, player: Player[]}} */
}

function noTeamError(teamName){
    const e = new TypeError("team " + teamName + " doesn't exists")
    Error.captureStackTrace(e)
    throw e
}

Team.prototype.initTeam = function(teamName, decider){
    if(typeof teamName === "string" && typeof decider === "function"){
        this.$teams[teamName] = decider
        return
    }
    const e = new TypeError("teamName: string, decider: function")
    Error.captureStackTrace(e)
    throw e
}

Team.prototype.teams = function(){
    return Object.keys(this.$teams)
}

Team.prototype.addPlayer = function(teamName, player){
    if(teamName in this.$teams){
        this.$players.push({ team: teamName, player: player })
        return
    }
    noTeamError(teamName)
}

Team.prototype.moveTeam = function(teamName, player){
    if(teamName in this.$teams){
        const target = this.$players.find(v => v.player === player)
        if(target === void 0){
            let e = new TypeError("the player doesn't exists")
            Error.captureStackTrace(e)
            throw e
        }
        if(target.team === teamName)
            return false
        target.team = teamName
        return true
    }
    noTeamError(teamName)
}

/** @param {Player|id} player */
Team.prototype.getTeamOf = function(player){
    if(typeof player === "string")
        for(let v of this.$players)
            if(v.player.id === player)
                return v.team
    else if(typeof player === "object")
        for(let v of this.$players)
            if(v.player === player)
                return v.team
    return null
}

Team.prototype.getAllPlayers = function(){
    return this.$players.slice()
}

Team.prototype.getMembers = function(teamName){
    if(teamName in this.$teams)
        return this.$players.filter(v => v.team === teamName)
    noTeamError(teamName)
}

Team.prototype.getMemberCount = function(teamName){
    if(teamName in this.$teams)
        return this.$players.filter(v => v.team === teamName).length
    noTeamError(teamName)
}

/** @returns {{ teamName: memberCount }} */
Team.prototype.getAllMemberCounts = function(){
    const res = {}
    for(let team in this.$teams)
        res[team] = 0
    this.$players.forEach(v => res[v.team]++)
    return res
}

Team.prototype.getDecider = function(teamName){
    if(teamName in this.$teams)
        return this.$teams[teamName]
    noTeamError(teamName)
}

// 승리 조건을 만족한 팀 반환
Team.prototype.decide = function(){
    for(let team in this.$teams)
        if(this.$teams[team](this.$players.slice()))
            return team
    return null
}


return { Team: Team }
})()