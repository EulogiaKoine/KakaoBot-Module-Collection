"use strict";

(function(){

Object.defineProperty(module.exports, "__wakelock__", {
    value: (function(){
        var res = App.getContext().getSystemService(android.content.Context.POWER_SERVICE)
            .newWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, '')
        res.setReferenceCounted(false)
        return res
    })(),
    writable: false,
    enumerable: false,
    configurable: true
})

Object.defineProperty(module.exports, 'on', {
    value(){
        if(this.__wakelock__ === null)
            Log.i("failed to wakelock acquire; no service context exists")
        else {
            this.__wakelock__.acquire()
            Log.i("wakelock turned on")
        }
    },
    enumerable: true
})

Object.defineProperty(module.exports, 'off', {
    value(){
        if(this.__wakelock__ === null)
            Log.e("failed to wakelock release; no service context exists")
        else {
            this.__wakelock__.release()
            Log.i("wakelock turned off")
        }
    },
    enumerable: true
})

Object.defineProperty(module.exports, 'isOn', {
    value(){
        if(this.__wakelock__ === null)
            return false;
        return this.__wakelock__.isHeld();
    },
    enumerable: true
})

})()