/**
 * @name Scenario
 * @author E. Koinē
 * @version 1.0.0(2024-01-15)
 * @description
 *   한 사건 내의 세부 내용을 순서대로 설명한 시나리오.
 */

"use strict"
module.exports = function(_, $rspire){

const { ConditionChecker } = $rspire('ConditionChecker')

function Scenario(){
    this.condition = null
    this.table = {}
    this.seq = []
}

Object.defineProperty(Scenario.prototype, 'size', {
    value(){ return this.seq.length }
})

Object.defineProperty(Scenario.prototype, 'idlist', {
    value(){ return Object.keys(this.table) }
})

Object.defineProperty(Scenario.prototype, 'getIdxById', {
    value(id){
        return this.table[id]
    }
})

Object.defineProperty(Scenario.prototype, 'getById', {
    value(id){
        id = this.table[id]
        return id? this.seq[id] || null: null
    }
})

Object.defineProperty(Scenario.prototype, 'getByIdx', {
    value(idx){
        return this.seq[idx] || null
    }
})

Object.defineProperty(Scenario.prototype, 'add', {
    value(v, id){
        v = this.seq.push(v)-1 // idx
        if(typeof id === "string")
            this.table[id] = v
    }
})

Object.defineProperty(Scenario.prototype, 'canStart', {
    value(player){
        return this.condition.every(v => new Calculator(v).calculate(player))
    }
})


return { Scenario: Scenario }
}