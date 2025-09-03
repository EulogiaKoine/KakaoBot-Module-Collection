"use strict"
module.exports = function(_, rs){
const { Component } = rs('Core')
const { DEFAULT_MAX_HP } = rs('constants')

/**
 * @param {Core} core
 * @param {int} max_hp
 */
function Life(core, max_hp){
    Component.call(this, core)
    this.hpc = max_hp || DEFAULT_MAX_HP
    this.hpm = max_hp || DEFAULT_MAX_HP
}
Component.extends(Life, "Life")

Life.Event.HEAL = Symbol('HEAL')
Life.Event.DAMAGED = Symbol('DMG')
Life.Event.DIE = Symbol('DIE')
Life.Event.RESURRECT = Symbol('RES')

Object.defineProperty(Life.prototype, 'getCurrHp', {
    value(){ return this.hpc }
})

Object.defineProperty(Life.prototype, 'getMaxHp', {
    value(){ return this.hpm }
})

Object.defineProperty(Life.prototype, 'isAlive', {
    value(){ return this.hpc !== 0 }
})

/** @param {int} mhp mhp > 0 */
Object.defineProperty(Life.prototype, 'setMaxHp', {
    value(mhp){
        this.hpm = mhp
        this.hpc = Math.min(this.hpc, mhp)
    }
})

/**
 * @param {int} v v > 0
 * @param {Core?} healer healer == null <=> healer = system
 */
Object.defineProperty(Life.prototype, 'heal', {
    value(v, healer){
        // listeners can modify the heal.v
        const heal = { v: v, healer: healer || null }
        this.trig(Life.Event.HEAL, heal)
        assert(heal.v >= 0, "heal amount must be >= 0")
        this.hpc = Math.min(this.hpc + heal.v, this.hpm)
    }
})

/**
 * @param {int} v v > 0
 * @param {Core?} atkr attacker; atkr == null <=> atkr = system
 */
Object.defineProperty(Life.prototype, 'dmg', {
    value(v, atkr){
        // listeners can modify the dmg.v
        const dmg = { v: v, attacker: atkr || null }
        this.trig(Life.Event.DAMAGED, dmg)
        assert(dmg.v >= 0, "dmg amount must be >= 0")
        if(this.hpc < dmg.v)
            this.die(atkr)
        else
            this.hpc = Math.max(this.hpc - dmg.v, 0)
    }
})

/**
 * @param {Core?} mdr murderer; murderer == null <=> murder = system
 */
Object.defineProperty(Life.prototype, 'die', {
    value(mdr){
        this.hpc = 0
        this.trig(Life.Event.DIE, mdr || null)
    }
})

/**
 * @param {Core?} rsr resurrector; if null then it's system
 */
Object.defineProperty(Life.prototype, 'resurrect', {
    value(rsr){
        this.trig(Life.Event.RESURRECT, rsr || null)
        this.hpc = 1
    }
})



return { Life: Life }
}