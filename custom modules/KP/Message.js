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

/**
 * @name Message
 * 
 */


(function(){

function Message(msg){
    /** @assert msg is msgbot.api2->Message */
    this.content = msg.content
    this.room = msg.room
    this.sender = msg.author.name
    Object.defineProperty(this, 'profileHash', {
        get(){
            const hash = java.lang.String(msg.author.avatar.getBase64()).hashCode()
            Object.defineProperty(this, 'profileHash', {
                value: hash,
                writable: true,
                enumerable: true,
                configurable: true
            })
            return hash
        },
        enumerable: true,
        configurable: true
    })
    this.senderId = msg.author.hash
    this.roomId = msg.channelId.toString()
    this.packageName = msg.packageName
    this.isDebugRoom = msg.isDebugRoom
    this.isGroupChat = msg.isGroupChat
    this.isMention = msg.isMention
    this.isMultiChat = msg.isMultiChat
    this.reply = (a, b) => b? msg.reply(a, b): msg.reply(a)
    this.markAsRead = () => msg.markAsRead()
}

Message.prototype.toString = function(){
    return `KP.Message{
        content     : ${this.content}
        room        : ${this.room}
        sender      : ${this.sender}
        profileHash : ${this.profileHash}
        senderId      : ${this.userId}
        roomId      : ${this.roomId}
        isGroupChat : ${this.isGroupChat}
        isMultiChat : ${this.isMultiChat}
        isDebugRoom : ${this.isDebugRoom}
        isMention   : ${this.isMention}
        packageName : ${this.packageName}
    }`
}

module.exports = Message
})()