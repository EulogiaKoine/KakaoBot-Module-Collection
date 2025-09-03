const MAIN_PATH = '/sdcard/믱봇/TEXT_RPG'
const Path = Object.freeze({
    MAIN: MAIN_PATH,
    MOB_FILE: MAIN_PATH + '/mob.json',
    MAP_FILE: MAIN_PATH + '/map.json',
    SKILL_FILE: MAIN_PATH + '/skills.json',
    NOVA_FILE: MAIN_PATH + '/nova.json',
    DEMON_FILE: MAIN_PATH + '/demon.json',
    ROLE_FILE: MAIN_PATH + '/role.json',
    USER_DIR: MAIN_PATH + '/user'
})

const USER_FRAME = Object.seal({
    rolelock: true,
    novlock: true, 
    name: null, 
    name2: [], 
    player: '없음', 
    RoleSkill: 'none', 
    rolesp: 1, 
    role: 'human', 
    rolenum: 0, 
    roledam: 0, 
    crystal: 0, 
    maps: ['Polluted forest'], 
    que: 'none', 
    story: 0, 
    fishing: false, 
    id: null, 
    lvl: 1, 
    exp: 0, 
    hp: 100, 
    mh: 100, 
    mp: 60, 
    dep: 1, 
    nolv: '1성', 
    tar: 1, 
    cri: 10, 
    Agi: 1, 
    str: 1, 
    sp: 15, 
    coin: 0, 
    give: {
    skill: undefined, 
    dam: undefined}, 
    armor: [], 
    weapon: [], 
    artipect: [], 
    skills: 'none', 
    nomsk: [], 
    CON: 0, 
    DEX: 0, 
    spdm: 0, 
    novsp: 1, 
    STR: 0, 
    nova: '없음', 
    nov: 0, 
    cha: '없음',
    num: null, 
    ch: 0, 
    avoid: 1, 
    ex: 0, 
    mhp: 'none', 
    mob: 'none', 
    mob_num: 'none', 
    mmp: 60, 
    exup: 1, 
    coup: 1, 
    heal: false, 
    fight: false, 
    sleep: false, 
    world: '1'
})


const UserManager = {
    ID_PATH: MAIN_PATH + '/user_id_list',
    id_list: null,
    table: {},

    exists(id){
        if(this.id_list === null)
            throw new Error("UserManager.exists - init() 먼저 해야해요")
        return this.id_list.includes(id)
    },
    
    // ID에 해당하는 유저 정보 가져오기
    get(id){
        return this.table[id]
    },

    // 새 유저 추가
    /**
     * @param {string} id 유저 구분용 ID
     * @param {string} name 유저 닉네임
     * @param {string} id2 ID 2개 있길래 넣었는데 뭔지 모르겠음
     */
    register(id, name, id2){
        if(this.id_list === null)
            throw new Error("UserManager.register - init() 먼저 해야해요")
        if(this.id_list.includes(id))
            throw new Error("UserManager.register - " + id + "(은)는 이미 등록된 상태예요")
        this.id_list.push(id)

        // 틀을 복제해서 ID, 닉네임, ID2?만 바꿔서 저장
        const data = Object.assign({}, USER_FRAME)
        data.id = id
        data.name = name
        data.num = id2
        this.table[id] = data

        this.saveIdData()
        this.saveUser(id)
    },

    // 유효한 유저ID 목록 불러오기
    init(){
        Object.defineProperty(this, 'id_list', {
            value: FileStream.read(this.ID_PATH).split('\n'),
            writable: false
        })
    },

    // 유효한 유저ID 목록 저장소에 저장
    saveIdData(){
        FileStream.write(this.ID_PATH, this.id_list.join('\n'))
    },

    loadUser(id){
        if(this.id_list === null)
            throw new Error("UserManager.loadUser - init() 먼저 해야해요")
        if(this.id_list.includes(id)){
            try {
                return this.table[id] = JSON.parse(FileStream.read(Path.USER_DIR + '/' + id + '.json'))
            } catch(e) {
                throw new Error("UserManager.loadUser - ID " + id + " 의 데이터 형식에 오류가 있어요")
            }
        }
        throw new ReferenceError("UserManager.loadUser - " + id + "(은)는 등록되지 않은 유저예요")
    },

    // 메모리에 유저 데이터 캐싱
    loadAll(){
        if(this.id_list === null)
            throw new Error("UserManager.loadAll - init() 먼저 해야해요")
        for(let id of this.id_list)
            this.loadUser(id)
    },

    // 유저 정보 배열 반환
    userlist(){
        return Object.keys(this.table).map(id => this.table[id])
    },

    // 특정 ID의 유저 정보를 내부 저장소에 저장
    saveUser(id){
        if(this.id_list === null)
            throw new Error("UserManager.saveUser - init() 먼저 해야해요")
        if(this.id_list.includes(id)){
            if(id in this.table && typeof this.table[id] === 'object')
                FileStream.write(
                    Path.USER_DIR + '/' + id + '.json',
                    JSON.stringify(this.table[id])
                )
            else
                throw new TypeError("UserManager.saveUser - ID " + id + " 의 데이터가 존재하나, 형식이 잘못되었어요. 확인해주세요.")
            return
        }
        throw new ReferenceError("UserManager.saveUser - ID " + id + "의 데이터가 존재하지 않습니다")
    },

    // 모든 유저 정보를 저장소에 저장
    saveAll(){
        if(this.id_list === null)
            throw new Error("UserManager.saveAll - init() 먼저 해야해요")
        this.id_list.forEach(id => this.saveUser(id))
    },

    // 특정 ID의 유저 영구 삭제
    delete(id){
        if(this.id_list === null)
            throw new Error("UserManager.delete - init() 먼저 해야해요")

        const idx = this.id_list.indexOf(id)
        if(idx === -1)
            throw new ReferenceError("UserManager.delete - ID " + id + "는 등록되지 않은 유저입니다.")

        this.id_list.splice(idx, 1)
        this.saveIdData()

        FileStream.remove(Path.USER_DIR + '/' + id + '.json')
    }
}