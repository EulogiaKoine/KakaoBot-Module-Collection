"use strict";

/**
 * @distortion_level 5
 * @name sort_some
 * @param {String} str 원본 문자열
 * @param {Int} n 교체 횟수
 */

module.exports = (function(){

return ((str, n) => {
    const L = str.length - 3
    if(L < -1) return str
    if(L === -1) return Math.random() < 0.5? str: str[1] + str[0]
    if(L === 0) {
        const r = Math.random()
        if(r < 1/3) return str[1] + str[0] + str[2]
        if(r < 2/3) return str[0] + str[2] + str[1]
        return str[2] + str[1] + str[0]
    }
    if(L === 1) return str[0] + (Math.random() < 0.5? (str[1] + str[2]): (str[2] + str[1])) + str[3]

    n >>= 0
    let i
    while(n-- > 0){
        i = Math.random() * L + 1 >> 0
        str = str.slice(0, i) + str[i+1] + str[i] + str.slice(i+2)
    }

    return str
}).bind();
})();