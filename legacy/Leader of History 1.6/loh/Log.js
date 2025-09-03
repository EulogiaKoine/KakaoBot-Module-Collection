module.exports = (function(){

function Log(){
    this.$a = {}
}

Log.prototype.getAll = function(id){
    if(typeof id === "string")
        return (this.$a[id] || []).slice()
    const e = new TypeError("userId must be string")
    Error.captureStackTrace(e)
    throw e
}

Log.prototype.add = function(id, type, value){
    if(typeof id === "string" && typeof type === "string" && typeof value === "string"){
        if(id in this.$a)
            this.$a[id].push({ type: type, value: value })
        else
            this.$a[id] = [{ type: type, value: value }]
        return
    }
    const e = new TypeError("userId, log type, value must be string")
    Error.captureStackTrace(e)
    throw e
}

Log.prototype.getOfType = function(id, type){
    if(typeof id === "string" && typeof type === "string"){
        if(id in this.$a)
            return this.$a[id].filter(v => v.type === type)
        return []
    }
    const e = new TypeError("userId and the log type must be string")
    Error.captureStackTrace(e)
    throw e
}

Log.prototype.getRecent = function(id){
    if(typeof id === "string"){
        if((id = this.$a[id]) === void 0)
            return null
        return Object.assign({}, id[id.length-1])
    }
    const e = new TypeError("userId and the log type must be string")
    Error.captureStackTrace(e)
    throw e
}

Log.prototype.removeRecent = function(id, count){
    if(typeof id === "string"){
        count = typeof count === "number"? (count >> 0): 1
        if(this.$a[id] === void 0)
            return false
        if(id.length < count)
            delete this.$a[id]
        else
            this.$a[id].splice(this.$a[id].length - count, count)
        return true
    }
    const e = new TypeError("userId and the log type must be string")
    Error.captureStackTrace(e)
    throw e
}

Log.prototype.clear = function(id){
    if(typeof id === "string"){
        return delete this.$a[id]
    }
    const e = new TypeError("userId and the log type must be string")
    Error.captureStackTrace(e)
    throw e
}


return { Log: Log }
})()