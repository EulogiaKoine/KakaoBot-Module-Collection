/**
 * @name UserDAO
 * @author E. Koinē
 * @version 1.0.0
 * 
 * @see UserManager(1.0.0+)
 * @see inspire(util.File)
 * 
 * @description
 *  사용자 정보 저장 및 불러오기
 */

"use strict"
module.exports = (function(){
inspire('util.File')

return {
    $um: null,
    $file: null,
    $unloaded: true, // true일 경우만 load 가능

    /** @param {UserManager} um */
    setManager(um){
        if(typeof um === "object")
            this.$um = um
    },

    getDirectory(){ return this.$file.path },
    setDirectory(dir){ // dir: string
        if(java.io.File(dir).exists())
            this.$file = new File(dir, true)
    },

    load(){
        if(this.$unloaded){
            this.$um.init(this.$file.load(true))
            delete this.$unloaded
        }
        throw new Error("UserDAO - already loaded")
    },

    save(){
        this.$file.write(this.$um.listDTO())
        this.$file.save()
    }
}
})()