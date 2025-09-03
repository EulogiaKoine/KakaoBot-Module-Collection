"use strict"
module.exports = (function(){

function PlayingData(){
    this.text = null
    this.$view = new Set()
}

PlayingData.prototype.bind = function(view){
    if(this.$view.has(view))
        throw new Error("PlayingData.bind - the view has already binded")
    this.$view.add(view)
}

PlayingData.prototype.unbind = function(view){
    if(this.$view.has(view))
        this.$view.delete(view)
    else
        throw new Error("PlayingData.unbind - the view doesn't binded")
}

PlayingData.prototype.getViews = function(){
    return Array.from(this.$view)
}

PlayingData.prototype.alertt = function(){
    this.$view.forEach(v => v.alert(this))
}


return { PlayingData: PlayingData }
})()