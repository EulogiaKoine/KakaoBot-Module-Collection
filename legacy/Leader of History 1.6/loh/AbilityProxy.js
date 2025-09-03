module.exports = (function(){

/** @typedef {./Player} Player */

/**
 * @interface
 * @typedef {Object} Ability
 * @property {string} class
 * @property {string} id
 * @property {number} priority
 * @property {Function(actor: Player, reactor: Player): void} fn
 */

function AbilityProxy(){
    this.$default = {}
    /** @type {{[userId: string]: Ability[]}} */
    this.$state = {}
}

AbilityProxy.prototype.setDefaultAbility = function(ability){
    this.$default[ability.class] = ability
}

AbilityProxy.prototype.removeDefaultAbility = function(abilityClass){
    return delete this.$default[abilityClass]
}

AbilityProxy.prototype.addAbilityState = function(id, ability){
    let state = this.$state[id]
    if(state === void 0){
        (this.$state[id] = {})[ability.class] = [ability]
        return true
    }
    if((state = state[ability.class]) === void 0){
        state[ability.class] = [ability]
        return true
    }
    if(state.indexOf(ability) === -1){ /** @assert Array.isArray(state) == true */
        state.push(ability)
        state.sort((a, b) => a.priority - b.priority)
        return true
    }
    return false
}

/** @assert typeof abilty == string or Ability */
AbilityProxy.prototype.removeAbilityState = function(id, ability /** id or Ability */){
    let state = this.$state[id]
    if(state === void 0)
        return false
    if(typeof ability === "object"){
        for(let _class in state){
            for(let i in (_class = state[_class]))
                if(_class[i] === ability || _class[i].id === ability.id){
                    _class.splice(i, 1)
                    return true
                }
        }
        return false
    }
    if(typeof ability === "string"){ // case: abilityId
        for(let _class in state){
            for(let i in (_class = state[_class])){
                if(_class[i].id === ability){
                    _class.splice(i, 1) // 원래 허용되지 않지만
                    return true // 바로 끝내서 다음 요소에 문제를 주지 않으니 괜찮
                }
            }
        }
        return false
    }
}

AbilityProxy.prototype.clearAbilityStates = function(id, _class){
    const state = this.$state[id]
    if(state === void 0)
        return false
    if(_class in state){
        if(Object.keys(state).length === 1)
            delete this.$state[id]
        else
            delete state[_class]
        return true
    }
    return false
}



AbilityProxy.prototype.getAbilityState = function(id, abilityId){
    if(abilityId === void 0)
        return null
    const state = this.$state[id]
    if(state === void 0)
        return null
    for(let _class in state)
        for(let v of state[_class])
            if(v.id === abilityId)
                return v
    return null
}

AbilityProxy.prototype.getAbilityStates = function(id, abilityClass){
    if(id in this.$state)
        return (this.$state[id][abilityClass] || []).slice()
    return []
}

// 현재 클래스에 대해 가능한 ability 객체 반환
AbilityProxy.prototype._runnable = function(abilityClass, actor){
    let state = this.$state[actor]
    if(state === void 0){
        if(typeof (state = this.$default[abilityClass]) === "object")
            return state
        const e = new TypeError("there's no ability class " + abilityClass + " applied")
        Error.captureStackTrace(e)
        throw e
    } else if(abilityClass in state){ /** @assert if then, Array.isArray(state[abilityClass]) == true */
        return state[abilityClass][0]
    }
    return null
}

/** @param {Player} actor   @param {Player} reactor (target) */
AbilityProxy.prototype.run = function(abilityClass, actor, reactor){
    const ab = this._runnable(abilityClass, actor.id)
    if(ab === null){
        const e = new TypeError("cannot find ability class " + abilityClass)
        Error.captureStackTrace(e)
        throw e
    }
    return ab.fn(actor, reactor)
}



return { AbilityProxy: AbilityProxy }
})()