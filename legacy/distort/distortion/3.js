"use strict";

/**
 * @distortion_level 3
 * @name insert_number_and_lowercase_alphabets
 * @param {String} str 원본 문자열
 * @param {Int} n 삽입 개수
 */

module.exports = (function(){

const _D = '0123456789abcdefghijklmnopqrstuvwxyz';
const _L = _D.length;

return ((str, n) => {
    n = n >> 0
    let i
    const L = str.length + 1
    while(n-- > 0){
        i = Math.random() * L >> 0
        str = str.slice(0, i) + _D[Math.random() * _L >> 0] + str.slice(i)
    }

    return str;
}).bind();
})();