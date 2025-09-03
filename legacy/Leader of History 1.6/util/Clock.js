/**
 * @name Clock
 * @see inspire
 * @description
 * 
 *  컴파일에 영향을 받지 않는 시간차 이벤트 발생 관리자.
 *  내부에서 
 */
module.exports = (function(){
const EventEmitter = inspire('util.events').EventEmitter
inspire('syntax.inherits')
inspire('extension.Object.deepCopy')


/**
 * @typedef {Object} alarm
 * @property {string} event event name that will be triggered
 * @property {number} end milisecond-time
 */
/**
 * @typedef {Object} alarmDTO
 * @property {string} event event name that will be triggered
 * @property {number} left millisecond
 */



// default delay of clock; unit=millisecond
let defaultTick = 1000

function Clock(){
    EventEmitter.init.call(this)
    this.setMaxListeners(Infinity)

    /** @type {[alarmDTO]} */
    this.$record = {}
    /** @type {number} */
    this.$interval = null // interval id
}
inherits(Clock, EventEmitter)

Clock.setDefaultTick = function(tick){
    tick >>= 0
    if(tick < 1){
        const e = new Error("tick must be greater than 0; input=" + tick)
        Error.captureStackTrace(e)
        e.name = "OutOfRangeError"
        throw e
    }
    defaultTick = tick
}


/** @param {number} tick unit=millisecond */
Clock.prototype.setTick = function(tick){
    tick >>= 0 // any typeof parameter to num; isNaN => 0
    if(tick < 1){
        const e = new Error("tick must be greater than 0; input=" + tick)
        Error.captureStackTrace(e)
        e.name = "OutOfRangeError"
        throw e
    }
    Object.defineProperty(this, 'tick', {
        value: tick,
        writable: true
    })
}
Object.defineProperty(Clock.prototype, 'tick', {
    get(){ return defaultTick }
})


/**
 * @returns {[{ id: { event: string, left: number }}]}
 * @assert this.isRunning() == true
 */
Clock.prototype._toLeftRecord = function(){
    const res = {}
    let rec
    for(let id in this.$record){
        rec = this.$record[id]
        res[id] = {
            event: rec.event,
            left: rec.end - Date.now()
        }
    }
    return res
}

/**
 * @returns {[{ id: { event: string, time: number } }]}
 * @assert this.isRunning() == false
 */
Clock.prototype._toTimeRecord = function(){
    const res = {}
    let rec
    for(let id in this.$record){
        rec = this.$record[id]
        res[id] = {
            event: rec.event,
            time: Date.now() + rec.left
        }
    }
    return res
}

Clock.prototype.isRunning = function(){
    return this.$interval !== null
}



Clock.prototype.start = function(){
    if(this.$interval === null){ // not running
        const record = (this.$record = this._toTimeRecord())
        this.$interval = setInterval(() => {
            const now = Date.now()
            for(let id in record){
                if(record[id].time <= now){
                    this.emit(record[id].event)
                    delete record[id]
                }
            }
        }, this.tick)
        return
    }

    const e = new Error("the alarm is already running")
    Error.captureStackTrace(e)
    throw e
}


Clock.prototype.stop = function(){
    if(this.$interval === null){
        const e = new Error("the alarm is already stopped")
        Error.captureStackTrace(e)
        throw e
    }
    clearInterval(this.$interval)
    this.$record = this._toLeftRecord(this.$record)
}




Clock.prototype.exists = function(id){
    return id in this.$record
}

Clock.prototype.triggerById = function(id){
    if(id in this.$record)
        return this.emit(this.$record[id].event)
    const e = new TypeError("id "+id+" doesn't exists")
    Error.captureStackTrace(e)
    throw e
}

Clock.prototype.count = function(){
    return Object.keys(this.$record)
}

/**
 * @param {string} event
 * @param {number|Date} time delay or an exact time indicated by Date object
 */
Clock.prototype.addAlarm = function(id, event, time){
    if(id in this.$record){
        let e = new TypeError("id "+id+" already exists")
        Error.captureStackTrace(id)
        throw e
    }

    if(typeof event === "string"){
        if(this.$interval === null){ // 실행 중이 아니라면
            this.$record[id] = {
                event: event,
                left: time instanceof Date? (time.getTime() - Date.now()): (time >> 0)
            }
        } else { // 실행 중이라면
            this.$record[id] = {
                event: event,
                time: time instanceof Date? time.getTime(): Date.now() + (time >> 0)
            }
        }
        return
    }

    let e = new TypeError('event must be a string')
    Error.captureStackTrace(e)
    throw e
}


Clock.prototype.removeAlarm = function(id){
    return delete this.$record[id]
}


/** @param {number} delay unit=ms */
Clock.prototype.addDelay = function(id, delay){
    if(id in this.$record){
        delay >>= 0
        if(this.$interval === null) // 작동 X
            this.$record[id].left += delay
        else
            this.$record[id].time += delay
        return
    }
    const e = new TypeError("id "+id+" doesn't exists")
    Error.captureStackTrace(e)
    throw e
}


// 남은시간(ms)
Clock.prototype.getLeft = function(id){
    if(id in this.$record){
        if(this.$interval === null) // 작동 X
            return this.$record[id].left
        else
            return this.$record[id].time - Date.now()
    }
    const e = new TypeError("id "+id+" doesn't exists")
    Error.captureStackTrace(e)
    throw 
}



/**
 * @assert this.isRunning() == 
 * @return {[{ id: string, event: string, time: Date }]}
 */
Clock.prototype.getTimeDTO = function(){
    const res = []
    let rec
    for(let id in this.$record){
        rec = this.$record[id]
        res.push({
            id: id,
            event: rec.event,
            time: new Date(typeof rec.time === "number"? rec.time: Date.now() + rec.left)
        })
    }
    return res
}

/** @return {[{ id: string, event: string, left: number }]} */
Clock.prototype.getLeftDTO = function(){
    const res = []
    let rec
    for(let id in this.$record){
        rec = this.$record[id]
        res.push({
            id: id,
            event: rec.event,
            left: typeof rec.left === "number"? rec.left: rec.time - Date.now()
        })
    }
    return res
}



inspire('util.File')
const ClockDAO = Object.seal({
    file: null,

    init(path){
        if(typeof path !== "string"){
            const e = new TypeError("path must be a string")
            Error.captureStackTrace(e)
            throw e
        }

        this.file = new File(path, true)
        if(this.file.exists)
           this.file.load()
        else {
            this.file.write({})
            this.file.save()
        }
    },

    /** @assert initialized */

    load(){
        if(this.file === null)
            throw new Error("ClockDAO.load - plz init first")
        this.file.load()
    },

    save(){
        if(this.file === null)
            throw new Error("ClockDAO.save - plz init first")
        this.file.save()
    },

    /** @return {[{ id: string, event: string, left: number }]} List<leftdto> */
    getDTO(){
        const res = [], record = this.file.read()
        for(let id in record)
            res.push({
                id: id,
                event: record[id].event,
                left: record[id].left
            })
        return res
    },

    /** @param {[{ id: string, event: string, left: number }]} leftdto */
    update(leftdto){
        const res = {}
        leftdto.forEach(v => res[v.id] = { event: v.event, left: v.left })
    }
})



return { Clock: Clock, ClockDAO: ClockDAO }
})()