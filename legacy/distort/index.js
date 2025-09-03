"use strict";

module.exports = (function(){

const insert = require('./insert.js');
const protectCopy = require('./protectCopy.js');

const DISTORTION_LEVELS = [1,3,4,5,6,8]; // 유효 왜곡 레벨
// 레벨별 문자열 왜곡 함수
const distortion = {};
for(let lv of DISTORTION_LEVELS){
    Object.defineProperty(distortion, lv, {
        value: require('./distortion/' + lv + '.js'),
        enumerable: true,
        configurable: true
    });
}

const _r = Math.random;

/**
 * @name distort
 * @param {String} str 왜곡시킬 문자열
 * @param {Int} n 왜곡 정도; 총 왜곡 수준과 관계있다.
 */
function distort(str, n){
    str = str.trim();
    n = n >> 0;

    let level, cost, unapplied = DISTORTION_LEVELS.filter(v => v <= n);
    while(n > 0){
        // 아직 적용되지 않은 왜곡 중 적용할 하나를 고르는 동시에 적용의 뜻으로 제외시킴.
        level = unapplied.splice(_r() * unapplied.length >> 0, 1);

        if(unapplied.length){ // = length > 0 = (현재 적용하려고 뽑은 것 포함)남은 미적용 왜곡히 하나 이상이라면
            if(level === n){ // n = 최소 소모 코스트인 경우 그냥 다 코스트로 전환.
                cost = n;
                n = 0;
            } else { // 아니라면, 최대 [1 ~ [n/level]] * level (level의 정수배)만큼 소모.
                n -= cost = (_r() * (n / level >> 0) + 1 >> 0) * level;
            }
        } else { // 아니라면, 남은 것 전부 해당 왜곡에 분배
            cost = n;
            n = 0;
        }

        // 저장된 함수를 실행하여 왜곡
        str = distortion[level](str, cost / level >> 0);
    }

    return str
}


const output = {
    distort: distort.bind(),
    insert: insert,
    protectCopy: protectCopy,
    distortion: distortion
};

Object.defineProperty(output, 'init', {
    value: (function init(global){
        for(let i in this){
            global[i] = this[i];
        }
    }).bind(output),
    configurable: true
});

return output;
})();