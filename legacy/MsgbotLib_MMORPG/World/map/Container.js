/**
 * @name Container
 * @description
 * 
 * 사실상 Room의 핵심 기능. Content를 담는다.
 */

module.exports = (function(){
const { Component } = rspire('World.base.Core')
/** @see Room */
/** @see interfaces.Content */

/** @param {Room} r core room */
function Container(r){
    Component.call(this, r)
    this.ct = new Set() // container
}
Component.extends(Container)

Container.Event.INVITE = Symbol('IV')
Container.Event.KICK = Symbol('K')

/** @param {Content} c */
Object.defineProperty(Container.prototype, 'has', {
    value(c){
        return this.ct.has(c)
    }
})

/** @returns {Content[]} 순서는 보장 못함 */
Object.defineProperty(Container.prototype, 'getContents', {
    value(){ return Array.from(this.ct) }
})

/**
 * @param {Content} c
 * @assert this.has(c) == false
 */
Object.defineProperty(Container.prototype, 'invite', {
    value(c){
        this.trig(Container.Event.INVITE, c)
        this.ct.add(c)
    }
})

/**
 * @param {Content} c
 * @assert this.has(c) == true
 */
Object.defineProperty(Container.prototype, 'kick', {
    value(c){
        this.trig(Container.Event.KICK, c)
        this.ct.delete(c)
    }
})



return { Container: Container }
})()