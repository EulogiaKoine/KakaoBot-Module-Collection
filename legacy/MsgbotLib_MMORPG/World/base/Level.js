"use strict"
module.exports = function(_, rs){
const { Component } = rs('Core')
const { exp_formula } = rs('constants')

function Level(core){
    Component.call(this, core)
    this.v = 1 // 현재 레벨
    this.e = 0 // 경험치
}
Component.extends(Level, "Level")

Level.Event.GAIN_EXP = Symbol('GEXP')
Level.Event.LEVEL_UP = Symbol('LVUP')

/** @param {number} v v >= 0 */
Object.defineProperty(Level.prototype, 'gainExp', {
    value(v){
        const e = {exp: v||0}
        this.trig(Level.Event.GAIN_EXP, e)
        assert(e.exp >= 0, "exp must be >= 0")
        this.e += e.exp
    }
})

Object.defineProperty(Level.prototype, 'levelUp', {
    value(){
        let d = 0
        while(this.e >= exp_formula(this.v)){
            this.e -= exp_formula(this.v)
            d++
        }
        if(d !== 0){
            this.trig(Level.Event.LEVEL_UP, {up: d})
            this.v += d
        }
    }
})

/** @param {int} d d >= 0 */
Object.defineProperty(Level.prototype, 'gainLevel', {
    value(d){
        if(d !== 0){
            this.trig(Level.Event.LEVEL_UP, {up: d})
            this.v += d
        }
    }
})


return {Level:Level}
}