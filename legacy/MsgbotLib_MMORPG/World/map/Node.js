/**
 * @name Node
 * @description
 * 방향 그래프를 이루는 노드. Room을 상속하여 Container Component를 속성으로 가진다.
 */

"use strict"
module.exports = function(_, rs){
const { Room } = rs('Room')

function Node(id, n){
    Room.call(this, id, n)
    this.fr = [] /** friends; @private @unchangable */
}
inherits(Node, Room)

Object.defineProperty(Node.prototype, 'getDirections', {
    value(){ return this.fr.slice() }
})

/** @param {Room} n */
Object.defineProperty(Node.prototype, 'isDirecting', {
    value(n){ return this.fr.indexOf(n) !== -1 }
})

/**
 * @param {Room} n
 * @assert isDirecting(n) == false
 */
Object.defineProperty(Node.prototype, 'direct', {
    value(n){ this.fr.push(n) }
})

/**
 * @param {Room} n
 * @assert isDirecting(n) == true
 */
Object.defineProperty(Node.prototype, 'cut', {
    value(n){ this.fr.splice(this.fr.indexOf(n), 1) }
})


return { Node: Node }
}