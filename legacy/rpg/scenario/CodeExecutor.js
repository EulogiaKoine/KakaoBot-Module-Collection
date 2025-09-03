/**
 * @name CodeExecutor
 * @author E. Koinē
 * @version 1.0.0(2024-01-15)
 * @description
 *   함수 테이블 관리자
 */

"use strict"
module.exports = function(){

const $table = {}

return {
    $table: $table,
    SEPERATOR: ' ',

    /**
     * @param {string} name
     * @param {function} fn
     */
    set(name, fn){
        $table[name] = fn
    },

    /**
     * @param {string} name
     */
    delete(name){
        return delete $table[name]
    },

    /**
     * @param {string} name
     * @param {string} args
     * @assert name in $table == true
     */
    run(name, args, thisObj){
        $table[name].apply(thisObj || null, args.split(this.SEPERATOR, $table[name].arity))
    }
}

}