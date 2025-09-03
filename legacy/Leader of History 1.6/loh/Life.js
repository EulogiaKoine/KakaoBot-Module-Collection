module.exports = (function(){

function Life(game){
    this.$v = {}
}

Life.prototype.set = function(id, v){
    return this.$v[id] = v >> 0
}

Life.prototype.get = function(id){
    return this.$v[id] || null
}

Life.prototype.increase = function(id, v){
    v = Math.floor(Math.abs(v))
    if(id in this.$v)
        return this.$v[id] += v
    return this.$v[id] = v
}

Life.prototype.decrease = function(id, v){
    v = Math.floor(Math.abs(v))
    if(id in this.$v)
        return this.$v[id] = Math.max(0, this.$v[id] - v)
    return this.$v[id] = 0
}

Life.prototype.isAlive = function(id){
    return id in this.$v && this.$v[id] > 0
}



return { Life: Life }
})()