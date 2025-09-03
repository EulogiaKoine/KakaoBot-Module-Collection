/**
 * @name Entity
 * @description
 * '이름'을 가지고, '죽거나 부서질 수 있는(has Life)' 것. 사물, 생명체 등.
 */

"use strict"
module.exports = function(_, rs){
const { Life } = rs('Life')
const { EntityFacade } = rs('EntityFacade')
const { Core } = rs('Core')

function Entity(name){
    Core.call(this)
    this.na = name
    this.lf = null
    this.fc = null
}
inherits(Entity, Core)

Object.defineProperty(Entity.prototype, 'name', {
    get(){ return this.na },
    /** @param {string} s a new name */
    set(s){ this.na = s }
})

Object.defineProperties(Entity.prototype, {
    getLife: {
        value(){ return this.lf }
    },
    setLife: {
        /** @param {Life} lf a new Life object */
        value(lf){ this.lf = lf }
    }
})

Object.defineProperties(Entity.prototype, {
    getFacade: {
        value(){ return this.fc }
    },
    setFacade: {
        /** @param {EntityFacade} fc a new Life object */
        value(fc){ this.fc = fc }
    }
})


const EntityDTO = {
    form: Object.freeze({
        id: String,
        name: String,
        life: Life,
        facade: EntityFacade
    }),
    from(e){
        return {
            id: e.id,
            name: e.na,
            life: e.lf,
            facade: e.fc
        }
    }
}


return { Entity: Entity, EntityDTO: EntityDTO }
}