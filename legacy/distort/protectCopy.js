"use strict"

/**
 * @name protectCopy
 * @descrition 복사 방지 문자열의 사이에 보이지 않는 공백문자를 삽입.
 */

module.exports = (function(){

return (str => {
    let r = "";
    const l = str.length;
    for(let i = 0; i < l; i++){
        r = r + "\u200b" + str[i];
    }
    return r;
}).bind();
})();