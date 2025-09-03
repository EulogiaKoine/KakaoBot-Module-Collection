/**
 * @see .Scenario
 */

"use strict"
module.exports = (function(){

function SceneWaiting(){
    this.next = []
    this.pendings = []
    this.waitings = []
}

SceneWaiting.prototype.ables = function(){
    return this.pendings.filter(v => v.condition())
}

SceneWaiting.prototype.getNextScene = function(){
    let res = this.next[0]
    if(res === void 0){
        const ables = this.ables()
        if(ables.length === 0)
            return null
        return ables.splice(Math.random() * ables.length >> 0, 1)[0]
        // const pendings = this.pendings(), L = pendings.length
        // do{
        //     res = pendings[Math.random() * L >> 0]
        // } while(!res.condition())
        // return res
    }
    return res
}

SceneWaiting.prototype.addNextScene = function(scene){
    return this.next.push(scene)
}

/** @param {number|void} waitCount natural number*/
SceneWaiting.prototype.addScene = function(scene, waitCount){
    if(typeof waitCount === "number")
        this.waitings.push({
            left: waitCount >> 0,
            scene: scene
        })
    else
        this.pendings.push(scene)
}

SceneWaiting.prototype.updateWaitCount = function(delta){
    delta >>= 0
    const left = []
    for(let v of this.waitings){
        v.left += delta
        if(v.left <= 0)
            this.pendings.push(v.scene)
        else
            left.push(v)
    }
    this.waitings = left
}


return { SceneWaiting: SceneWaiting }
})()