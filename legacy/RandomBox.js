"use strict";

module.exports = (function(){

/**
 * @constructor
 */
function RandomBox(){
    Object.defineProperty(this, '_box', {
        value: new Map()
    });
}

const _proto_ = RandomBox.prototype;

/**
 * @param {*} value result when opened
 * @param {number} rate initial rate
 */
Object.defineProperty(_proto_, 'set', {
    value(value, rate){
        if(isNaN(rate))
            throw new TypeError("RandomBox.set - 2nd argument, rate must be a number");

        this._box.set(value, rate)
        return this;
    },
    configurable: true
});

/**
 * @param {*} value value to remove
 */
Object.defineProperty(_proto_, 'remove', {
    value(value){
        return this._box.delete(value);
    },
    configurable: true
});

/**
 * @return total sum of rates
 */
Object.defineProperty(_proto_, 'total', {
    get(){
        let t = 0;
        for(let v of this._box.values())
            t += v;
        return t;
    },
    configurable: true
});

/**
 * @param {Boolean} isPure if, then return pure rate applied
 * @return {Array} _box to list
 */
Object.defineProperty(_proto_, 'getChanceInfo', {
    value(isPure){
        if(isPure)
            return Array.from(this._box).map(v => ({ value: v[0], rate: v[1] }))

        const t = this.total;
        return Array.from(this._box)
            .map(v => {
                return {
                    value: v[0],
                    rate: v[1] / t
                };  
            });
    },
    configurable: true
});


Object.defineProperty(_proto_, 'open', {
    value(){
        let v = Math.random() * this.total;
        for(let i of this._box){
            v -= i[1]
            if(v <= 0) return i[0]
        }
    },
    configurable: true
});


return RandomBox;
})();