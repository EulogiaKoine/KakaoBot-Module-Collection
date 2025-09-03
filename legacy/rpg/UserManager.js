/**
 * @name UserManager
 * @author E. Koinē
 * @version 1.0.0
 * 
 * @description
 *  사용자 계정 정보 관리용 모듈
 */

"use strict"
module.exports = (function(){

function generateID(){
    java.lang.Thread.sleep(1) // ID 유일함 보장
    return Date.now().toString().split('').map(v => Math.random() < 0.5? v: "abcdefghijklmnopqrstuvwxyz.$^*"[(+v + Math.random())*3 >> 0]).join('')
}


const table = {} // uid: User
const htable = {} // hash: User
const PW_REG = /^[0-9A-z가-힣_^*]{8,}$/  // 영어+한글+숫자+(_*^) 로 8글자 이상

/**
 * 
 * @param {string} profileHash 
 * @param {string} pw PW_REG.test(pw) == true   불안해서 걍 쓰기
 */
function User(profileHash, pw){
    if(typeof profileHash === "string" && typeof pw === "string"){
        if(PW_REG.test(pw))
            this.pw = pw
        else
            throw new TypeError("User - password doesn't follow the pattern; " + PW_REG.toString())
        this.hash = profileHash
    } else {
        throw new TypeError("User - 1st_arg=profile hashcode, 2nd=password; all them must be string")
    }
    Object.defineProperty(this, 'id', {
        value: generateID(),
        enumerable: true
    })
    this.room = null
}

Object.defineProperty(User.prototype, 'password', {
    get(){ return this.pw },
    set(pw){
        if(typeof pw === "string" && PW_REG.test(pw))
            this.pw = pw
        else
            throw new TypeError("User - password doesn't follow the pattern; " + PW_REG.toString())
    }
})

Object.defineProperty(User.prototype, 'profileHash', {
    get(){ return this.profileHash },
    set(hash){
        if(typeof hash === "string")
            this.hash = hash
        else
            throw new TypeError("User - profileHash must be a string")
    }
})

Object.defineProperty(User.prototype, 'checkPassword', {
    value(pw){
        return typeof pw === "string" && PW_REG.test(pw)
    }
})


function toString(user){
    return {
        id: user.id,
        profileHash: user.hash,
        password: user.pw
    }
}
function from(dto){
    const user = Object.defineProperty({}, 'id', {
        value: user.id,
        enumerable: true
    })
    user.hash = dto.profileHash
    user.pw = dto.password
    Object.setPrototypeOf(user, User.prototype)
    return user
}

return {
    PASSWORD_REG: PW_REG,
    $data: table,
    $hdata: htable,

    getById(uid){
        return table[uid] || null
    },
    getByHash(hash){
        return htable[hash] || null
    },

    register(hash, pw){
        if(hash in htable)
            throw new TypeError("UserManager.register - User(hash=" + hash + ") has already been registered")
        const user = new User(hash, pw)
        table[user.id] = user
        htable[hash] = user
    },

    updateHash(id, new_hash){
        const user = table[id]
        if(user === void 0)
            throw new TypeError("UserManager.updateHash - there's no user(id=" + id + ")")
        const before = user.profileHash
        user.profileHash = new_hash
        delete htable[before]
        htable[new_hash] = user
    },
    
    delete(id){
        if(id in table){
            const user = table[id]
            delete table[id]
            delete htable[user.profileHash]
            return
        }
        throw new TypeError("UserManager.delete - there's no user(id=" + id + ")")
    },

    list(){
        const res = []
        let i = 0
        for(let id in table)
            res[i++] = table[id]
        return res
    },

    listDTO(){
        return this.list().map(v => toString(v))
    },

    init(dto_list){
        if(Object.keys(table).length === 0){
            if(Array.isArray(dto_list)){
                dto_list.forEach(v => {
                    const user = from(v)
                    table[user.id] = user
                    htable[user.profileHash] = user
                })
            } else {
                throw new TypeError("UserManager.init - User DTO list must be an array")
            }
        } else {
            throw new Error("UserManager.init - established user list must be empty")
        }
    }
}
})()