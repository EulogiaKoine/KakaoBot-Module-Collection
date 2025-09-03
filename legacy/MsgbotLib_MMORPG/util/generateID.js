"use strict"
module.exports = (function(){
const CHARS = "abcdefghijklmnopqrstuvwxyz.$^*"
return { generateID(){
        return Date.now().toString().split('').map(v => Math.random() < 0.5? v: CHARS[(+v + Math.random())*3 >> 0]).join('')
} }
})()