/**
 * @see .Scenario
 */

"use strict"
module.exports = (function(){

function StoryTeller(){
    this.playing = null
    this.$focus = -1
}

StoryTeller.prototype.isPlaying = function(){
    return this.playing !== null
}

StoryTeller.prototype.getCurrentScene = function(){
    return this.playing
}

Object.defineProperty(StoryTeller.prototype, 'focus', {
    get(){
        return this.$focus
    },
    set(v){ /** @assert isPlaying() == true */
        if(v >= this.playing.size())
            throw new RangeError("StoryTeller.focus - out of scenario size(" + v + " > " + this.playing.size() + ")")
        this.$focus = v >> 0
    }
})

StoryTeller.prototype.focusOnById = function(id){
    id = this.playing.getIdxById(id)
    if(id === null)
        throw new ReferenceError("StoryTeller.focusOnById - such id " + id + " doesn't exist in the scenario")
    this.$focus = id // index
}

StoryTeller.prototype.getFocusingId = function(){
    const t = this.playing.table
    for(let id in t)
        if(t[id] === this.$focus)
            return id
    return null
}

StoryTeller.prototype.getFocusing = function(){
    return this.playing.getByIdx(this.$focus)
}

/** @assert isPlaying() == false */
StoryTeller.prototype.startScene = function(scene){
    this.playing = scene
    this.$focus = 0
}

/** @assert isPlaying() == true */
StoryTeller.prototype.endScene = function(){
    this.playing = null
    this.$focus = -1
}


return { StoryTeller: StoryTeller }
})()