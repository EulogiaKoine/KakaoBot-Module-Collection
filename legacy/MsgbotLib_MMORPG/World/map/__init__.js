"use strict"
module.exports = function(_, map){
return {
    class: {
        Container: map('Container').Container,
        Room: map('Room').Room,
        Node: map('Node').Node
    }
}
}