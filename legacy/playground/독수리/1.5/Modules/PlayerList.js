module.exports = {

        load: function(){
            const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
            let list = JSON.parse(FileStream.read(sdcard+'/Leader_of_History/1.5/Server/PlayerList.json'));
            return Object.assign(list,this);
        },

        save: function(){
            const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
            FileStream.write(sdcard+'/Leader_of_History/1.5/Server/PlayerList.json',JSON.stringify(this,null,"    "));
        },

        player: function(name){
            if(!this.codes.some(v=>v.name==name)) return false;
            const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
            const module = require(sdcard+'/Leader_of_History/1.5/Modules/Player.js');
            return module.load(this.codes.find(v=>v.name==name).code);
        },


        add: function(name,code){
            let c = {
                "name": name,
                "code": code
            };
            this.codes.push(c);
            this.teams.unassigned.push(name);
            let j = {
                "name": name,
                "job": null
            };
            this.jobs.push(j);3
            this.heads.unassigned++;
            this.save();
            return true;
        },
        delete: function(name){
            if(!this.codes.some(v=>v.name==name)) return false;
            const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
            FileStream.remove(sdcard+'/Leader_of_History/1.5/Players/'+this.codes.find(v=>v.name==name).code+'.json');
            let index = this.codes.findIndex(v=>v.name==name);
            this.codes.splice(index,1);
            for(let team in this.teams){
                let i = this.teams[team].indexOf(name);
                if(i!=-1) {
                    this.teams[team].splice(i,1);
                    break;
                }
            }
            this.jobs.splice(index,1);
            if(this.deads.includes(name)) this.deads.splice(this.deads.indexOf(name),1);
            this.heads.unassigned--;
            this.save();
            return true;
        },

        deleteAll: function(){
            const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
            for(i=0; i<this.codes.length; i++){
                FileStream.remove(sdcard+'/Leader_of_History/1.5/Players/'+this.codes[i].code+'.json');
            }
            this.codes = [];
            this.teams = {
                unassigned: [],
                cretes: [],
                restes: [],
                ormas: []
            };
            this.jobs = [];
            this.deads = [];
            this.heads = {
                unassigned: 0,
                cretes: 0,
                restes: 0,
                ormas: 0
            };
            this.save();
            return true;
        },

        moveTeam: function(name,team){
            if(!["unassigned","cretes","restes","ormas"].includes(team)) throw "PlayerList_Error: cannot move team to undefined "+team;
            if(!this.codes.some(v=>v.name==name)) throw "PlayerList_Error: player \""+name+"\" doesn't exists.";
            let Player = this.player(name);
            for(t in this.teams){
                let index = this.teams[t].indexOf(name);
                if(index!=-1) {
                    this.teams[t].splice(index,1);
                    this.heads[t]--;
                    if(Player.job == "정치가") this.heads[t]--;
                    break;
                }
            }
            this.teams[team].push(name);
            this.heads[team]++;
            if(Player.job == "정치가") this.heads[team]++;
            Player.moveTeam(team);
            this.save();
            return true;
        },

        distributeJobs: function(){
            const num = +this.codes.length;
            let base1 = ["기사단장","의원"];
            let base2 = ["암살자"];
            let cretes = [];
            let restes = [];
            let ormas = [];
            let proportion = {
                cretes: 0,
                restes: 0,
                ormas: 0
            };
            switch(num){
                case 4:
                    cretes.push("부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    proportion.cretes = 1;
                    proportion.restes = 0;
                    break;
                case 5:
                    cretes.push("정치가","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    proportion.cretes = 2;
                    proportion.restes = 0;
                    break;
                case 6:
                    cretes.push("정치가","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    restes.push("건달","정보원","스파이","테러리스트");
                    proportion.cretes = 2;
                    proportion.restes = 1;
                    break;
                case 7:
                    cretes.push("정치가","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    restes.push("건달","정보원","스파이","테러리스트");
                    proportion.cretes = 2;
                    proportion.restes = 1;
                    break;
                    base2.push("암살자")
                case 8:
                    base2.push("암살자");
                    restes.push("건달","정보원","스파이","테러리스트");
                    cretes.push("정치가","성녀","광전사","마술사","계승자","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    proportion.cretes = 3;
                    proportion.restes = 1;
                    break;
                case 9:
                    base2.push("암살자");
                    restes.push("건달","정보원","스파이","테러리스트");
                    cretes.push("정치가","성녀","광전사","마술사","계승자","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    ormas.push("교주");
                    proportion.cretes = 3;
                    proportion.restes = 1;
                    proportion.ormas = 1;
                    break;
                case 10:
                    base2.push("암살자");
                    restes.push("건달","정보원","스파이","테러리스트");
                    cretes.push("정치가","성녀","광전사","마술사","계승자","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    ormas.push("교주");
                    proportion.cretes = 4;
                    proportion.restes = 1;
                    proportion.ormas = 1;
                    break;
                case 11:
                    base2.push("암살자","암살자");
                    restes.push("건달","정보원","스파이","테러리스트");
                    cretes.push("정치가","성녀","광전사","마술사","계승자","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    ormas.push("교주");
                    proportion.cretes = 4;
                    proportion.restes = 1;
                    proportion.ormas = 1;
                    break;
                case 12:
                    base2.push("암살자","암살자");
                    restes.push("건달","정보원","스파이","테러리스트");
                    cretes.push("정치가","성녀","광전사","마술사","계승자","부기사단장","근위대장","연금술사","사교꾼","기자","영매사");
                    ormas.push("교주");
                    proportion.cretes = 5;
                    proportion.restes = 1;
                    proportion.ormas = 1;
                    break;
            }
            function rand(array,num){
                if(array.length<=1) return array;
                let arr = array.concat();
                let result = [];
                for(i=0;i<parseInt(num);i++){
                    let index = Math.floor(Math.random()*arr.length);
                    result.push(arr[index]);
                    arr.splice(index,1);
                }
                return result;
            }
            let all = base1.concat(base2,rand(cretes,proportion.cretes),rand(restes,proportion.restes),ormas);
            let loop = all.length;
            all = rand(all,loop);
            for(i=0; i<loop; i++){
                let job = all.shift();
                this.jobs[i].job = job;
                let Player = this.player(this.jobs[i].name);
                Player.getJob(job);
                if(cretes.includes(job) || base1.includes(job)) this.moveTeam(Player.name,"cretes");
                if(restes.includes(job) || base2.includes(job)) this.moveTeam(Player.name,"restes");
                if(ormas.includes(job)) this.moveTeam(Player.name,"ormas");
            }
            this.heads.unassigned = 0;
            this.save();
            return true;
        }



    };
