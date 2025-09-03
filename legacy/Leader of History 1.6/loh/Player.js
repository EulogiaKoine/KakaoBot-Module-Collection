/**
 * @name Player
 * @description
 *  player 폴더 내 컴포넌트들의 복합체(Composite)이자 퍼사드(Facade)
 */

module.exports = function(_, rspire){
inspire('syntax.inherits')

function Player(id, { life, log, bag, abilityProxy, job, team, clock }){
    this.id = id
    this.$life = life
    this.$log = log
    this.$bag = bag
    this.$ability = abilityProxy
    this.$job = job
    this.$team = team
    this.$clock = clock

    this.$view = null
}

Player.prototype.healed = function(v){
    return this.$life.increase(this.id, v)
}

Player.prototype.damaged = function(v){
    return this.$life.decrease(this.id, v)
}

Player.prototype.isAlive = function(){
    return this.$life.isAlive(this.id)
}

Player.prototype.record = function(type, value){
    this.$log.add(this.id, type, value)
}

Player.prototype.getRecentLog = function(){
    return this.$log.getRecent(this.id)
}

Player.prototype.removeRecentLog = function(count){
    return this.$log.removeRecent(this.id, count)
}

Player.prototype.clearLog = function(){
    this.$log.clear(this.id)
}

Player.prototype.getItemList = function(){
    return this.$bag.getList(this.id)
}

Player.prototype.getItemCount = function(item){
    return this.$bag.count(this.id, item)
}

Player.prototype.getItem = function(item, amount){
    this.$bag.give(this.id, item, amount)
}

Player.prototype.loseItem = function(item, amount){
    return this.$bag.clear(this.id, item, amount)
}

Player.prototype.getJob = function(){
    return this.$job.getJob(this.id)
}

Player.prototype.setJob = function(job){
    return this.$job.setJob(this.id, job)
}

Player.prototype.getSkills = function(){
    return this.$job.getSkills(this.id)
}

/** @param {Player} target */
Player.prototype.act = function(abilityClass, target){
    this.$ability.run(abilityClass, this, target)
}

/** @param {Ability} ability */
Player.prototype.addState = function(ability){
    return this.$ability.addAbilityState(this.id, ability)
}

/** @param {Ability|string} ability */
Player.prototype.removeState = function(ability){
    return this.$ability.removeAbilityState(this.id, ability)
}

Player.prototype.getTeam = function(){
    return this.$team.getTeamOf(this)
}

Player.prototype.getClock = function(){
    return this.$clock
}


/** @param {./PlayerView.ts -> PlayerView} view */
Player.prototype.bindView = function(view){
    this.$view = view
}

Player.prototype.hear = function(str){
    if(this.$view === null)
        return false
    this.$view.notify(this, str)
    return true
}


return { Player: Player }
}