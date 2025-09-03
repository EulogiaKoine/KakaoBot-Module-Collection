module.exports = {

    load: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let events = JSON.parse(FileStream.read('/sdcard/Leader_of_History/1.5/Server/Events.json'))
        return Object.assign(events,this);
    },

    save: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        FileStream.write(sdcard+'/Leader_of_History/1.5/Server/Events.json',JSON.stringify(this,null,"    "));
        return true;
    },


    add: function(name,seconds){
        if(isNaN(seconds)) throw "Events_Error: timer's seconds must be a number";
        if(seconds < 0) throw "Events_Error: timer's seconds must be larger than 0";
        if(this.timers.some(v=>v.name==name)){
            this.timers.find(v=>v.name==name).end += Math.floor(seconds);
            this.save();
            return true;
        }
        function Frame(name,seconds){
            let now = Math.floor(new Date().getTime()/1000);
            this.name = name;
            this.end = Math.floor(now+seconds);
        }
        this.timers.push(new Frame(name,seconds));
        this.save();
        return true;
    },

    subtract: function(name,seconds){
        if(!this.timers.some(v=>v.name==name)) return false;
        let now = Math.floor(new Date().getTime()/1000);
        if(this.timers.find(v=>v.name==name).end <= seconds) {
            this.timers.find(v=>v.name==name).end = now;
            this.save();
            return true;
        }
        this.timers.find(v=>v.name==name).end -= Math.floor(seconds);
        this.save();
        return true;
    },

    delete: function(name){
        if(!this.timers.some(v=>v.name==name)) return false;
        let index = this.timers.findIndex(v=>v.name==name);
        this.timers.splice(index,1);
        this.save();
        return true;
    },


    deleteAll: function(){
        this.timers = [];
        this.save();
        return true;
    },


    loadProcess: function(name){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        if(!java.io.File(sdcard+'/Leader_of_History/1.5/Process/Events').list().map(v=>v).includes(name+'.js')) return false;
        let process = require(sdcard+'/Leader_of_History/1.5/Process/Events/'+name+'.js');
        return process;
    }
    
};