"use strict"
module.exports = function(_, rs){
return {
    constants: rs('constants'),
    class: Object.assign({}, 
        rs('EventObserver'),
        rs('Core'),
        rs('Entity'),
        rs('EntityFacade'),
        rs('Life'),
        rs('Level'),
        rs('Producer')
    )
}
}