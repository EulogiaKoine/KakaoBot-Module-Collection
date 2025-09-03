"use strict"
module.exports = (function(){

function EventObserver(){
    this.lis = {}
}

Object.defineProperty(EventObserver, 'Event', {
    value: { /*
        EVENT_KEY: Symbol
*/  },
    enumerable: true
})

// 이벤트 리스너 클래스의 확장을 위함.
// 정적 속성 중 Event는 객체이기에, 이를 확장시켜주는 기능만 추가.
// this === 부모 클래스
Object.defineProperty(EventObserver, 'extends', {
    value(Child){
        inherits(Child, this)
        Object.defineProperty(Child, 'Event', {
            value: Object.assign({}, this.Event),
            enumerable: true
        })
    }
})



/**
 * @param {string} type any
 * @returns {boolean}
 */
Object.defineProperty(EventObserver.prototype, 'isValidType', {
    value(p){
        const ev = this.constructor.Event
        for(let t in ev)
            if(ev[t] === p) return true
        return false
    }
})

/**
 * @param {EventObserver.Event.TYPE} type
 * @returns {function[]}
 */
Object.defineProperty(EventObserver.prototype, 'listeners', {
    value(t){
        assert(() => this.isValidType(t), "invalid event type " + t.toString(), 1)
        return (this.lis[t] || []).slice()
    }
})

/**
 * @param {EventObserver.Event.TYPE} type
 * @param {function} fn listener function
 * @param {int} p priority of listener. sorted within ascending order
 */
Object.defineProperty(EventObserver.prototype, 'on', {
    value(type, fn, p){
        assert(() => this.isValidType(type), "invalid event type " + type.toString(), 1)
        if(type in this.lis){
            const lis = this.lis[type]
            assert(() => lis.indexOf(fn) === -1, "it's already listening!", 2)
            lis[lis.length] = { f: fn, p: p }
            lis.sort((a, b) => a.p - b.p)
        } else {
            this.lis[type] = [{ f: fn, p: p }]
        }
    }
})

/**
 * @param {EventObserver.Event.TYPE} type
 * @param {function} fn
 */
Object.defineProperty(EventObserver.prototype, 'off', {
    value(type, fn){
        const l = this.lis[type]
        assert(() => this.isValidType(type), "invalid event type " + type.toString(), 1)
        assert(() => l && l.find(v => v.f === fn) !== void 0, "it's not listening!", 2)
        if(l.length === 1) delete this.lis[type] 
        else l.splice(l.findIndex(v => v.f === fn), 1)
    }
})

/**
 * @param {EventObserver.Event.TYPE} type
 * @param {object} arg
 * @memo apply & _splice.call의 환장의 콜라보로 성능 저하.
 *       따라서, 리스너 함수에 가변 인자 대신 고정적으로 하나만 넣음.
 *       인자를 추가로 넣길 원할 경우 오버라이딩해야죠 뭐...
 */
Object.defineProperty(EventObserver.prototype, 'trig', {
    value(type, arg){
        assert(() => this.isValidType(type), "invalid event type " + type.toString(), 1)
        if(type in this.lis)
            for(let l of this.lis[type].values())
                l.f.call(this, arg)
    }
})


Object.defineProperty(EventObserver.prototype, 'once', {
    value(type, fn){
        this.on(type, function _t_(arg){
            fn.call(this, arg)
            this.off(type, _t_)
        })
    }
})


return { EventObserver: EventObserver }
})