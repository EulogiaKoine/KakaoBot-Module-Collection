/**
 * @name Room
 * @description
 * 
 *  Core, 혹은 엔티티 간 상호작용이 이뤄지는 공간.
 */

"use strict"
module.exports = function(_, rs){
const { Container } = rs('Container')

/**
 * @param {string} id 식별자;
 * @param {string} n name
 */
function Room(id, n){
    this.id = id /** @public @readonly */
    this.name = n /** @public */
    this.ct = null /** @private */
}

Object.defineProperties(Room.prototype, {
    getContainer: {
        value(){ return this.ct }
    },
    /** @param {Container} c */
    setContainer: {
        value(c){ this.ct = c }
    }
})


const RoomDTO = {
    form: {
        id: String,
        name: String,
        ct: Container
    },
    /** @param {Room} r */
    from: r => ({
        id: r.id,
        name: r.name,
        container: r.ct
    })
}

/** @param {RoomDTO} dt */
Object.defineProperty(Room, 'from', {
    value(dt){
        const r = new Room(dt.ic, dt.name)
        r.ct = dt.container
        return r
    }
})


return {Room:Room}
}