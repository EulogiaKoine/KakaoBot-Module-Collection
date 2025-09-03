"use strict"
module.exports = (function(){

/** @param {function} condition which returns boolean */
function Scenario(code, condition){
    this.code = code
    this.condition = condition
    this.table = {}
    this.seq = []
}

Scenario.prototype.size = function(){
    return this.seq.length
}

Scenario.prototype.idlist = function(){
    return Object.keys(this)
}

Scenario.prototype.getIdxById = function(id){
    return this.table[id] || null
}

Scenario.prototype.getById = function(id){
    id = this.table[id]
    return id === null? false: this.seq[id] || null
}

Scenario.prototype.getByIdx = function(idx){
    return this.seq[idx] || null
}

return { Scenario }
})()