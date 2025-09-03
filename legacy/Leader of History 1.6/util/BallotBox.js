/**
 * @name BallotBox
 * @description
 *  투표함.
 * 
 *  '과반' 판정은 '유효 투표수'의 절반 초과이다.
 *  ex) 표 10개 중 6개 이상
 */

module.exports = (function(){

function BallotBox(){
    /** @private */
    this.$voted = {} /** @type {{ 투표자: 투표값 }} */
}

/** @returns {boolean} 중복 투표 시 false */
BallotBox.prototype.vote = function(voter, target){
    if(voter in this.$voted)
        return false
    if(typeof voter === "string" && typeof target === "string"){
        this.$voted[voter] = target
        return true
    }
    const e = new TypeError("missing voter(input=" + voter + ") or target(input=" + target + ")")
    Error.captureStackTrace(e)
    throw e
}

/** @returns {string|null} target */
BallotBox.prototype.hasVoted = function(voter){
    return this.$voted[voter] || null
}

/** @returns { target: number } */
BallotBox.prototype.counts = function(){
    const res = {}
    for(let v in this.$voted){
        v = this.$voted[v]
        if(v in res)
            res[v]++
        else
            res[v] = 1
    }
    return res
}

/** @returns {Array<target: string>} */
BallotBox.prototype.targets = function(){
    const res = []
    for(let v in this.$voted){
        v = this.$voted[v]
        if(res.indexOf(v) === -1)
            res.push(v)
    }
    return res
}

BallotBox.prototype.total = function(){
    return Object.keys(this.$voted).length
}

BallotBox.prototype.half = function(){
    return this.total() / 2 >> 0
}

/** @returns {target: string | null} 과반이 넘은 투표 대상 */
BallotBox.prototype.getResult = function(){
    const half = this.half(), counts = this.counts()
    for(let target in counts)
        if(counts[target] > half)
            return target
    return null
}



return { BallotBox: BallotBox }
})()