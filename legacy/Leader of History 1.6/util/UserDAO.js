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
        this.$file = new File(dir, true)
    },

    load(){
        if(this.$unloaded){
            if(this.$file.exists){
                this.$um.init(this.$file.load(true))
                return delete this.$unloaded
            }
            return false
        }
        throw new Error("UserDAO - already loaded")
    },

    save(){
        this.$file.write(this.$um.listDTO())
        this.$file.save()
    }
}
})()