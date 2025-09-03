/**
 * @see .GameData
 */
"use strict"
module.exports = (function(){

function Player(data, teller, wait, exe){
    this.data = data
    this.teller = teller
    this.waiting = wait
    this.executor = exe
}

Player.prototype.moveScene = function(){
    if(this.teller.isPlaying()){
        this.teller.endScene()
        this.data.played_scene_count++
        this.waiting.updateWaitCount(-1)
    }
    const next = this.waiting.getNextScene()
    if(next === null)
        return false
    this.teller.startScene(next)
    return true
}

Player.prototype.play = function(){
    if(this.teller.isPlaying()){
        const t = this.teller
        const block = t.getFocusing()
        const idx = t.focus
        this.executor.run(block.fn, block.arg)

        // focus가 블럭의 실행 결과로 변하지 않았으면 직접 이동 시도. endScene()이 호출된 경우도 focus가 변하므로 커버 가능.
        // 잠정적으로 편집하는 블럭에 대한 논리적 의존성이 있...나? 불필요한 조건 검사 한 번이라고 치면 의존까진 아닐 듯.
        if(idx === t.focus && idx+1 !== t.playing.size())
            t.focus++ // 포커스가 시나리오의 끝에 도달하지 않았을 경우에만 포커스 이동
    }
}

Player.prototype.isPlaying = function(){
    return this.teller.isPlaying()
}


return { Player: Player }
})()