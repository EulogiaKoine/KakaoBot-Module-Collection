/**
 * @name LOHJobDistributor
 * @description
 *  역사의 인도자 1.6의 플레이 직업을 인원수에 따라 결정한다.
 *  바로 분배가 가능하도록 해당 인원수만큼, 섞어서 반환한다.
 */

module.exports = (function(){
inspire('extension.Array.shake')
inspire('extension.Array.random')

return Object.seal({
    MIN_COUNT: 4, // 최소 플레이 인원
    MAX_COUNT: 12,

    /**
     * @param {int} count 플레이 인원수; MIN
     */
    distribute(count){
        count >>= 0
        if(count < this.MIN_COUNT || count > this.MAX_COUNT){
            const e = new TypeError("member count must be in range[" + this.MIN_COUNT + ", " + this.MAX_COUNT + "]")
            Error.captureStackTrace(e)
            throw e
        }

        const base = ["기사단장", "의원", "암살자"] // 기본이자 결과 배열
        const add_cretes = ["부기사단장", "근위대장", "연금술사", "사교꾼", "기자", "영매사"]
        const add_restes = []

        let subRestes = false
        
        // 암살자 추가
        if(count >= 7) base.push("암살자")
        if(count >= 10) base.push("암살자")

        // 5+인플 정치가, 크레테스 인원 추가
        if(count >= 5) add_cretes.push("정치가")

        // 6+인플 레스테스 부직 추가
        if(count >= 6){
            add_restes.push("건달", "정보원", "스파이")
            subRestes = true
        }

        // 8+인플 추가
        if(count >= 8){
            add_cretes.push("성녀", "광전사", "마술사", "계승자")
            add_restes.push("테러리스트")
        }

        // 9+인플 교주 추가
        if(count >= 9) base.push("교주")

        count -= base.length

        // 레스테스 부직 등록
        if(subRestes) base.push(add_restes.random())

        // 남은 인원은 전부 크레테스
        while(count--)
            base.push(add_cretes.randomPop())

        return base.shake()
    }
})
})()