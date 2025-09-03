'use strict';
module.exports = {

    data: new File(
        android.os.Environment.getExternalStorageDirectory().getAbsolutePath()
            + '/Leader_of_History/1.5/Server/Game.json',
        true
    ),

    load: function(){
        let res = this.data.read()
        if(res === null)    
            res = this.data.load()
        if(typeof res.load === 'function')
            return res
        return Object.assign(res, this)
    },

    save: function(){
        this.data.save()
        // const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        // FileStream.write(sdcard+,JSON.stringify(this,null,"    "));
    },


    playerlist: function(){
        return Module_PlayerList.load()
        // const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        // const listpack = require(sdcard+'/Leader_of_History/1.5/Modules/PlayerList.js');
        // return listpack.load();
    },

    events: function(){
        return Module_Event.load()
        // const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        // let eventpack = require(sdcard+'/Leader_of_History/1.5/Modules/Events.js');
        // return eventpack.load();
    },

    player: function(name){
        if(this.players.indexOf(name) === -1)
            return false

        return Module_Player.target(name) || false
        // const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        // let playerpack = require(sdcard+'/Leader_of_History/1.5/Modules/Player.js');
        // let playerlist = JSON.parse(FileStream.read(sdcard+'/Leader_of_History/1.5/Server/PlayerList.json'));
        // return playerpack.load(playerlist.codes.find(v=>v.name==name).code);
    },


    announce: function(message){
        const prefix = "  🎲 𝐋𝐞𝐚𝐝𝐞𝐫 𝐨𝐟 𝐇𝐢𝐬𝐭𝐨𝐫𝐲 🎲";
        return Api.replyRoom(this.room,prefix+"\n• "+message);
    },


    makeRoom: function(room,manager,code){
        if(this.recuiting) return false;
        this.room = room;
        this.manager.name = manager;
        this.manager.code = code;
        this.recuiting = true;
        this.players.push(manager);
        this.save();
        return true;
    },

    deleteRoom: function(){
        if(this.room == undefined) return false;
        this.room = null;
        this.manager.name = null;
        this.manager.code = null;
        this.recuiting = false;
        this.gaming = false;
        this.voting = false;
        this.votes = [];
        this.day = 0;
        this.isDay = false;
        this.players = [];
        this.save();
        var PlayerList = this.playerlist();
        PlayerList.deleteAll();
        var Events = this.events();
        Events.deleteAll();
        return true;
    },



    join: function(name){
        this.players.push(name);
        this.save();
        return true;
    },  

    exit: function(name){
        this.players.splice(this.players.indexOf(name),1);
        this.save();
        return true;
    },


    execute: function(name){
        let Player = this.player(name);
        let executeResult = Player.die();
        if(!executeResult[0]) {
            this.announce("");
            return false;
        }
        this.save();
        return true;
    }


};