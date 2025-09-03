/**
 * @name EntityFacade
 * @description
 *  Entity가 공간 상에 투영하는 모습, 또는 상
 */

"use strict"
module.exports = function(_, rs){
const { Component } = rs('Core')
/** @see map.Content */
/** @see map.Room */
/** @see Entity */

/**
 * @implements map.Content
 * @param {Entity?} core
 * @param {string} name
 */
function EntityFacade(core){
    Component.call(this, core)
    /** @type {Room} */
    this.loc = null // 장소
}
Component.extends(EntityFacade, "Facade")

EntityFacade.Event.ENTER = Symbol('ENTER')
EntityFacade.Event.EXIT = Symbol('EXIT')

Object.defineProperty(EntityFacade.prototype, 'getName', {
    value(){ return this.core.name }
})

Object.defineProperty(EntityFacade.prototype, 'location', {
    get(){ return this.loc }
})

/**
 * @param {Room} r
 * @assert this.loc == null
 */
Object.defineProperty(EntityFacade.prototype, 'enter', {
    value(r){
        this.trig(EntityFacade.Event.ENTER, r)
        this.loc = r
    }
})

/**
 * @param {Room} r
 * @assert this.loc != null
 */
Object.defineProperty(EntityFacade.prototype, 'exit', {
    value(r){
        this.trig(EntityFacade.Event.EXIT, r)
        this.loc = null
    }
})


return { EntityFacade: EntityFacade }
}