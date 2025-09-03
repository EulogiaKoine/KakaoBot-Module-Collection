"use strict"
module.exports = (function(){

function Executor(){
    this.table = {}
}

Executor.prototype.set = function(id, fn){
    this.table[id] = fn
}

Executor.prototype.get = function(id){
    return this.table[id] || null
}

Executor.prototype.run = function(id, input){
    id = this.table[id]
    if(id === null)
        throw new ReferenceError("Executor.run - such id doesn't applied(" + id + ")")
    id(input)
}

return { Executor: Executor }
})()