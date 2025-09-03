"use strict";

/**
 * @distortion_level 4
 * @name intert_symbol_and_uppercase_ALPHABETS
 * @param {String} str 원본 문자열
 * @param {Int} n 삽입 개수
 */

module.exports = (function(){

const insert = require('../insert.js');

const _D = '~!@#$%^&*()-_=+/?|[]{}:;,.<>ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const _L = _D.length;
const _r = Math.random;

return ((str, n) => {
    n = n >> 0;
    while(n-- > 0){
        str = insert(str, _r() * (str.length + 1) >> 0, _D[_r() * _L >> 0]);
    }

    return str;
}).bind();
})();