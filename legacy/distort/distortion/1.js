"use strict";

/**
 * @distortion_level 1
 * @name delete/insert_extra_space
 * @param {String} str 원본 문자열
 * @param {Int} n 
 */

module.exports = (function(){

const insert = require('../insert.js');
const _r = Math.random;

return ((str, n) => {
    const _L = str.length;
    let blank, noBlank, i, j; // 라이노 미워......

    while(n > 0){
        if(noBlank || _r() > 0.5){ // 맨 앞뒤 제외 띄어쓰기 1개 삽입
            str = insert(str, _r() * (str.length - 1) + 1 >> 0, " ");

            n--;
        } else { // 띄어쓰기 제거

            // 띄어쓰기(이외 공백 제외) 추출
            if(blank === void 0){ // = blank가 undefined라면, 즉 한 번도 띄어쓰기 제거 프로세스를 거치지 않았다면
                // 띄어쓰기 인덱스 추출
                blank = [];
                for(i = 0; i < _L; i++){
                    if(str[i] === " ") blank.push(i);
                }
            }
    
            // 띄어쓰기가 없으면 반환
            if(!blank.length){
                noBlank = true;
                continue;
            }
    
            // 임의의 띄어쓰기 1개 삭제
            i = _r() * blank.length >> 0; // blank에서의 인덱스
            j = blank.splice(i, 1)[0]; // 문자열에서의 인덱스
            str = str.slice(0, j) + str.slice(j + 1);

            // 띄어쓰기가 없으면 반환
            if(!blank.length){
                noBlank = true;
                continue;
            }

            // 제거한 인덱스가 blank의 인덱스가 0이 아니라면 이어지는 인덱스를 하나씩 당기기.
            if(i !== 0){
                for(j in blank){
                    if(j > i) blank[j]--;
                }
            }
    
            n--;
        }   
    }

    return str;
}).bind();
})();