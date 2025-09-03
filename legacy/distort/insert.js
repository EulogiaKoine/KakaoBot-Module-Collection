"use strict";

module.exports = (function(){

return ((str, index, text) => str.slice(0, index) + text + str.slice(index)).bind();
})();