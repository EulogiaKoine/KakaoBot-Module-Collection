"use strict"
module.exports = function(PATH, r_spire){
const { generateID } = rspire('util.generateID')
const { EventObserver } = r_spire('EventObserver')


// ---------- Core ----------
// Component를 속성으로 갖는 복합체 클래스
// 사실상 id: string의 interface
// 사물, 몹 등의 엔티티들은 Core를 상속하는 방향으로 확장, 발전시켜나간다.
function Core(){
    this.id = generateID()
}
// ---------- Core ----------


// 제일 핵심
// ---------- Component ----------
const CODE_SEPERATOR = '/'

/**
 * @param {Core?} core
 * @extends EventObserver @implements {Core}
 */
function Component(core){
    EventObserver.call(this)
    this.id = generateID()
    this.setCore(core || null)
}
EventObserver.extends(Component)

Object.defineProperty(Component, 'CODE', {
    value: '',
    enumerable: true
})

/** @override */
Object.defineProperty(Component, 'extends', {
    value(Child, CODE){
        EventObserver.extends.call(this, Child)
        CODE = this.CODE + (this.CODE === ''? '': CODE_SEPERATOR) + CODE
        /** @override */
        Object.defineProperty(Child, 'CODE', { value: CODE, enumerable: true })
        Object.defineProperty(Child.prototype, 'CODE', { value: CODE })
    },
    enumerable: true
})

/** @param {Core?} core */
Object.defineProperty(Component.prototype, 'setCore', {
    value(core){
        if(core === null) this.core = null
        else this.core = core
    }
})
// ---------- Component ----------



return { Core: Core, Component: Component }
}