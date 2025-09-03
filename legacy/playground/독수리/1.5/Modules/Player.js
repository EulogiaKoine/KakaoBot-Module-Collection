'use strict';
module.exports = {

    load: function(code){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let player = FileStream.read(sdcard+'/Leader_of_History/1.5/Players/'+code+'.json');
        if(player == null) player = {};
        else player = JSON.parse(player);
        let result = Object.assign(player,this);
        delete result.load;
        delete result.makeNew;
        return result;
    },
 
    save: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        FileStream.write(sdcard+'/Leader_of_History/1.5/Players/'+this.code+'.json',JSON.stringify(this,null,"    "));
        return true;
    },

    game: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        const gamepack = require(sdcard+'/Leader_of_History/1.5/Modules/Game.js');
        return gamepack.load();
    },
    playerlist: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let listpack = require(sdcard+'/Leader_of_History/1.5/Modules/PlayerList.js');
        return listpack.load();
    },
    events: function(){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let eventpack = require(sdcard+'/Leader_of_History/1.5/Modules/Events.js');
        return eventpack.load();
    },
    
    target: function(name){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let playerlist = JSON.parse(FileStream.read(sdcard+'/Leader_of_History/1.5/Server/PlayerList.json'));
        if(!playerlist.codes.some(v=>v.name==name)) return false;
        let playerpack = require(sdcard+'/Leader_of_History/1.5/Modules/Player.js');
        return playerpack.load(playerlist.codes.find(v=>v.name==name).code);
    },

    makeNew: function(name,code,room){
        function Frame(name,code,room){
            this.name = name;
            this.code = code;
            this.room = room;
            this.job = null;
            this.team = null;
            this.death = {
                alive: true,
                resurgent: true
            };
            this.ability = [];
            this.log = {
                voteTarget: null,
                abilityTarget: null,
                abilityName: null,
                user: null
            };
            this.bag = [];
            this.ables = {
                vote: true,
                useAbility: true,
                modifyTime: false
            };
            this.process = {
                voting: [],
                usingAbility: [],
                becomingDay: [],
                becomingNight: [],
                beUnderAttack: [],
                observed: [],
                dying: []
            };  
        }
        let profile = new Frame(name,code,room);
        return Object.assign(profile,this);
    },

    hear: function(teller,message){
        const prefix = " 🎲[ Leader of History ]🎲\n";
        if(teller=='system') {
            return Api.replyRoom(this.name,prefix+"• "+message);
        }
        return Api.replyRoom(this.name,prefix+" > "+teller+" : "+message);
    },


    loadProcess: function(type,name){
        if(!Object.keys(this.process).includes(type)) throw "Player_Error: cannot load process type named \""+type+"\"";
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        if(!java.io.File(sdcard+'/Leader_of_History/1.5/Process/'+type).list().map(v=>v).includes(name+'.js')) return false;
        let process = require(sdcard+'/Leader_of_History/1.5/Process/'+type+'/'+name+'.js');
        return process;
    },

    addProcess: function(type,name,countable,count){
        if(!Object.keys(this.process).includes(type)) throw "Player_Error: cannot modify process type named \""+type+"\"";
        if(this.process[type].some(v=>v.name==name)){
            let index = this.process[type].findIndex(v=>v.name==name);
            this.process[type][index].countable = Boolean(countable);
            this.process[type][index].count = +count;
            return true;
        }
        function Frame(name,countable,count){
            this.name = String(name);
            this.countable = Boolean(countable);
            this.count = +count;
        }
        let process = new Frame(name,countable,count);
        this.process[type].push(process);
        return true;
    },

    deleteProcess: function(type,name){
        if(!Object.keys(this.process).includes(type) || !this.process[type].some(v=>v.name)) return false;
        let index = this.process[type].findIndex(v=>v.name==name);
        this.process[type].splice(index,1);
        this.save();
        return true;
    },

    subtractProcess: function(type,name,count){
        if(!Object.keys(this.process).includes(type) || !this.process[type].some(v=>v.name)) return false;
        let index = this.process[type].findIndex(v=>v.name==name);
        if(count == null) count = 1;
        if(!this.process[type][index].countable) return false;
        this.process[type][index].count -= +count;
        if(this.process[type][index].count <= 0) this.process[type].splice(index,1);
        this.save();
        return true;
    },


    getAbility: function(name){
        this.ability.push(name);
        return true;
    },


    moveTeam: function(team){
        if(!["unassigned","cretes","restes","ormas"].includes(team)) throw "Player_Error: cannot move team to undefined "+team;
        this.team = team;
        this.save();
    },

    getJob: function(job){
        const jobs = ["기사단장","부기사단장","의원","근위대장","연금술사","사교꾼","기자","영매사","정치가","성녀","광전사","마술사","계승자","암살자","건달","정보원","스파이","테러리스트","교주","잉여"];
        if(!jobs.includes(job)) throw "Player_Error: the job named \""+job+"\" doesn\'t exitsts.";
        this.job = job;
        this.ability = [];
        this.process = {
            voting: [],
            usingAbility: [],
            becomingDay: [],
            becomingNight: [],
            beUnderAttack: [],
            observed: [],
            dying: []
        };
        switch(job){
            case jobs[0]:
                this.getAbility("수사");
                this.addProcess("becomingDay","기사단장",false,1);
                break;
            case jobs[1]:
                this.getAbility("귀납");
                this.addProcess("becomingDay","부기사단장",false,1);
                break;
            case jobs[2]:
                this.getAbility("주치의");
                this.addProcess("becomingDay","치료_종료",false,1);
                break;
            case jobs[3]:
                this.addProcess("beUnderAttack","철벽수비",true,1);
                this.addProcess("observed","순찰",false,1);
                break;
            case jobs[4]:
                this.getAbility("이그나이트");
                this.addProcess("becomingDay","고위_연금술",false,1);
                break;
            case jobs[5]:
                this.getAbility("초대");
                this.addProcess("becomingDay","사교의_정점",false,1);
                break;
            case jobs[6]:
                this.getAbility("특종");
                this.addProcess("becomingNight","기사_수집",true,2);
                break;
            case jobs[7]:
                this.getAbility("성불");
                break;
            case jobs[8]:
                this.addProcess("voting","달변",false,1);
                this.addProcess("voting","정치_수완",false,1);
                break;  
            case jobs[9]:
                this.getAbility("기도");
                this.getAbility("희생");
                this.addProcess("observed","빛의_신념",false,1);
                break;
            case jobs[10]:
                this.getAbility("광폭");
                this.getAbility("혼신");
                break;
            case jobs[11]:
                this.getAbility("트릭");
                this.addProcess("dying","트릭",true,1);
                break;
            case jobs[12]:
                this.getAbility("계승");
                break;
            case jobs[13]:
                this.getAbility("암살");
                this.getAbility("밀회");
                this.addProcess("becomingNight","대의명분",false,1);
                break;
            case jobs[14]:
                this.getAbility("폭행");
                this.getAbility("납치");
                this.getAbility("밀회");
                this.addProcess("becomingNight","영업_준비",false,1);
                break;
            case jobs[15]:
                this.getAbility("위증");
                this.getAbility("밀회");
                this.addProcess("becomingNight","인포메이터",false,1);
                break;
            case jobs[16]:
                this.getAbility("유혹");
                this.getAbility("밀정");
                this.getAbility("밀회");
                this.addProcess("becomingNight","변장의_귀재",false,1);
                break;
            case jobs[17]:
                this.getAbility("테러");
                this.getAbility("밀회");
                this.addProcess("dying","테러",false,1);
                break;
            case jobs[18]:
                this.getAbility("세뇌");
                this.getAbility("설파");
                this.addProcess("becomingNight","사이비_교주",false,1);
                break;
            case jobs[19]:
                break;
        }
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let script = require(sdcard+'/Leader_of_History/1.5/Server/Scripts/Jobs/'+job+'.js')(this);
        if(script != undefined) this.hear("system","당신은 "+job+"입니다."+"\u200b".repeat(500)+"\n\n\n"+script);
        this.save();
        return true;
    },

 
    addItem: function(name,amount){
        if(amount == null) amount = 1;
        switch(this.bag.some(v=>v.name == name)){
            case true:
                this.bag.find(v=>v.name == name).amount += +amount;
                break;
            default:
                this.bag.push({"name":name,"amount":amount});
        }
        this.save();
        return true;
    },

    subtractItem: function(name,amount){
        if(amount == null) amount = 1;
        if(!this.bag.some(v=>v.name == name)) return false;
        this.bag.find(v=>v.name == name).amount -= +amount;
        if(this.bag.find(v=>v.name == name).amount <= 0) this.bag.splice(this.bag.findIndex(v=>v.name == name),1);
        this.save();
        return true;
    },


    die: function(message){
        if(!this.death.alive) return false;

        let death = true;

        if(this.process.dying.length>0){
            for(let i=0; i<this.process.dying.length; i++){
                let name = this.process.dying[i].name;
                let process = this.loadProcess("dying",name);
                if(process != false){
                    let result = process.isAble(this);
                    if(!result[0]){
                        this.hear("system",result[1]);
                        death = false;
                    }
                    process.func(this.game(),this);
                }
                this.subtractProcess("dying",name,1);
            }
        }

        if(!death){
            this.save();
            return false;
        }

        this.death.alive = false;
        this.ables.vote = false;
        this.ables.useAbility = false;
        this.ables.modifyTime = false;
        this.save();

        let PlayerList = this.playerlist();
        PlayerList.deads.push(this.name);
        PlayerList.heads[this.team]--;
        if(this.job == "정치가") PlayerList.heads[this.team]--;
        PlayerList.save();

        this.hear("system",(message==null?"사망하였습니다.":message)+"\u200b".repeat(500)+"\n\n* hl 사화 (할말) 을 통해 죽은 자들끼리 소통할 수 있습니다. 사화 이외, 본 게임방에서의 채팅은 금합니다.");

        return true;
    },

    resurrect: function(message){
        if(!this.death.resurgent) return false;

        this.death.alive = true;
        this.save();

        let PlayerList = this.playerlist();
        PlayerList.deads.splice(PlayerList.deads.indexOf(this.name),1);
        PlayerList.heads[this.team]++;
        if(this.job == "정치가") PlayerList.heads[this.team]++;
        PlayerList.save();

        this.hear("system",message==null?"부활하였습니다.":message);
        
        return true;
    },


    attacked: function(Attacker,message){

        let attacked = true;

        for(let i=0; i<this.process.beUnderAttack.length; i++){
            let name = this.process.beUnderAttack[i].name;
            let process = this.loadProcess("beUnderAttack",name);
            if(process == false) continue;
            let result = process.isAble(this,Attacker);
            attacked = result[0];
            if(!attacked) this.hear("system",result[1]);
            process.func(this,Attacker);
            this.subtractProcess("beUnderAttack",name,1);   
        }
        
        if(attacked){
            this.die(message);
            let Game = this.game();
            Game.announce(this.name+"(이)가 누군가에게 살해당하였습니다.");
        }

        return true;
    },


    useAbility: function(name,target){
        const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
        let path = sdcard+'/Leader_of_History/1.5/Server/Abilities';
        if(!java.io.File(path).list().map(v=>v).includes(name+'.js')) return false;

        let usable = true;

        if(this.process.usingAbility.length>0){
            for(let i=0; i<this.process.usingAbility.length; i++){
                let n = this.process.usingAbility[i].name;
                let process = this.loadProcess("usingAbility",n);
                if(process == false) continue;
                let result = process.isAble(this);
                usable = result[0];
                if(!usable) this.hear("system",result[1]);
                process.func(this);
                this.subtractProcess("usingAbility",n,1);
            }
        }

        if(!usable) return false;

        let ability = require(path+'/'+name+'.js');
    
        usable = ability.isAble(this,target);
        if(!usable[0]){
            this.hear("system",usable[1]);
            return false;
        }
        
        if(target == this.name){
            ability.func(this,this);
            return true;
        }

        let Target = this.target(target);
        ability.func(this,Target);
        return true;
    }


};