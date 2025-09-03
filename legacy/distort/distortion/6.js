"use strict";

/**
 * @distortion_level 6
 * @name normalize_NFD_in_one
 * @param {String} str 원본 문자열
 * @param {Int} n 자모 분해 개수
 */

module.exports = (function(){

const _r = Math.random;
const Hangul = require('../Hangul.js')

return ((str, n) => {
    let l = str.length;
    const kor = [];

    let s;
    for(let i = 0; i < l; i++){
        if((s = str[i].charCodeAt()) > 44031 && s < 55204){
            kor.push(i);
        }
    }
    if(kor.length === 0) return str; // 유니코드 번호가 '가'보다 크고 '힣'보다 작은 경우, 즉 한글 조합이 없는 경우 그냥 반환

    // kor(한글 조합)이 존재하는 동안 n 번 실행
    let index;
    for(let j = 0; kor.length !== 0 && j < n; j++){
        // 분해할 인덱스(한글로 인정된 인덱스 중에서만 설정)
        index = kor[_r() * kor.length >> 0];

        // 자모 분해
        s = Hangul.d(str[index]).join('')

        // 해당 위치를 자모 분해된 글자로 대체
        str = str.slice(0, index) + s + str.slice(index + 1)

        // 뒤에 이어지는 것들은 늘어난 인덱스만큼 늘려줌
        for(let j = kor.indexOf(index) + 1; j < kor.length; j++)
            kor[j] += s.length - 1

        kor.splice(index, 1);
    }
    
    
    return str;
}).bind();
})();