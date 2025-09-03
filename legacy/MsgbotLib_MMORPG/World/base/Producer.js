/**
 * @name Producer
 * @description
 *  사용자에게 드러낼 스크립트 생산; 일종의 '프로듀싱' 담당.
 * 
 *  ScriptManager을 통해 불러낼 순수 텍스트의 ID를 테이블로 저장, produce(가공에 쓰이는 객체)를 통해 문자열을 생산한다.
 *  기초가 되는 소스(텍스트ID)를 결정하는 책임을 가진다.
 */

"use strict"
module.exports = function(_, rs){
const { Component } = rs('Core')
/** @see interfaces.ScriptManager */

function Producer(core){
    Component.call(this, core)
    /** @public */
    this.src = {}
}
Component.extends(Producer)

Producer.Event.PRODUCE = Symbol('PR')  // 문자열 생산에 필요한 정보에 관여
Producer.Event.GENERATE = Symbol('GR') // 생산된 문자열에 관여


inspire('extension.Array.random')
inspire('extension.Object.values')
/**
 * @param {object?} i 가공에 필요한 정보
 * @description
 *  '문자열 생산'이라는 책임의 분리
 * @return {string}
 */
Object.defineProperty(Producer.prototype, 'generate', {
    value(i){
        i = i || {}
        i.txt = ScriptManager.getText(i.src || Object.values(this.src).random())
        this.trig(Producer.Event.GENERATE, i)
        return i.txt
    }
})

/** @returns {string} */
Object.defineProperty(Producer.prototype, 'produce', {
    value(i){
        this.trig(Producer.Event.PRODUCE, i)
        return this.generate(i)
    }
})


return { Producer: Producer }
}