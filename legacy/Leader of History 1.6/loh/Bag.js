module.exports = (function(){

function Bag(){
    this.$bag = {}
}

// 일괄 설정
Bag.prototype.set = function(id, list){
    const bag = (this.$bag[id] = {})
    list.forEach(item => bag[item.id] = item.amount >> 0)
}

/** @returns {[{ id: string, amount: number }]} */
Bag.prototype.getList = function(id){
    if(id in this.$bag){
        const res = [], bag = this.$bag[id]
        for(let item in bag)
            res.push({ id: item, amount: bag[item]})
        return res
    }
    return []
}

Bag.prototype.count = function(id, item){
    if(id in this.$bag)
        return this.$bag[id][item] || 0
    return 0
}

// 아이템 추가. 미등록 ID여도 가능.
/** @param {int?} amount >= 0 */
Bag.prototype.give = function(id, item /** itemId */, amount){
    if(!(id in this.$bag))
        this.$bag[id] = {}
    if(amount === void 0)
        return
    const bag = this.$bag[id]
    if(item in bag)
        bag[item] += amount >> 0
    else
        bag[item] = amount
}

// 아이템 감소.
// 부족할 시 0개로 만들고 true 반환.
Bag.prototype.clear = function(id, item, amount){
    if(id in this.$bag){
        const bag = this.$bag[id]
        if(item in bag){
            if(amount === void 0 || bag[item] <= amount)
                delete bag[item]
            else
                bag[item] -= amount >> 0
            return true
        }
        return false
    }
    return false
}


return { Bag: Bag }
})()