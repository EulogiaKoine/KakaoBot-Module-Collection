/**
 * @name StoryTeller
 * @author E. Koinē
 * @version 1.0.0(2024-01-15)
 * @description
 *   여러 시나리오를 연속해서 진행시킨다.
 */

"use strict"
module.exports = function(_, $rspire){
const CodeExecutor = $rspire('CodeExecutor')
const { Scenario } = $rspire('Scenario')


function StoryTeller(player){
    this.player = player
    this.playing = null
    this.$focus = -1

    this.next = null
    this.scenes = []
    this.waitings = []
}

/**
 * @param {Scenario} scene
 * @param {int} waitCount > 0
 */
StoryTeller.prototype.addScenario = function(scene, waitCount){
    if(typeof waitCount === "number"){
        this.waitings.push({
            left: waitCount,
            scene: scene
        })
    } else {
        this.scenes.push(scene)
    }
}

StoryTeller.prototype.getCurrentScene = function(){
    return this.playing || null
}

StoryTeller.prototype.isPlaying = function(){
    return this.playing !== null
}

Object.defineProperty(StoryTeller.prototype, 'focus', {
    get(){ return this.$focus }
})

/**
 * @assert this.isPlaying() == true
 * @param {int} idx 0 <= idx < this.getCurrentScene().size()
 */
StoryTeller.prototype.focusOn = function(idx){
    this.$focus = idx
}

/**
 * @assert this.isPlaying() == true
 * @param {string} id
 */
StoryTeller.prototype.focusOnById = function(id){
    this.$focus = this.playing.getIdxById(id)
}


/**
 * @assert this.isPlaying() == true
 */
StoryTeller.prototype.runner = function(){
    return this.playing.getById(this.$focus)
}


/**
 * @assert this.isPlaying() == true
 */
StoryTeller.prototype.run = function(){
    const sc = this.playing.getById(this.$focus)
    // 텍스트, 함수, 선택지에 따라 다르게 처리
    // UI나 게임 자체를 필요로 하는 건 생각하지 말고, 반환값으로 관련된 DTO를 전달하기
    
}





return { StoryTeller: StoryTeller }
}