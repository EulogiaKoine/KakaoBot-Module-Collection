/*
MIT License annotation


Copyright (c) 2025 Eulogia Koinē

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/


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