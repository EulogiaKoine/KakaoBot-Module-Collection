/**
 * @name ScriptManager
 * @description
 * 
 *  가공되기 전의 텍스트를 불러온다.
 * 
 *  - get 요청이 들어오면 내부 저장소로부터 정해진 형식에 따라 텍스트를 읽어와 1차적으로 가공, 테이블로 캐싱한다.
 *  - 부가적으로, 메모리 관리를 위해 일정 주기로 쓰이지 않는 텍스트의 테이블을 비운다.
 * 
 * 스크립트 파일은 기본적으로 아래 규칙을 따른다.
 * 
 * 1. 확장자: ScriptParser.getExtension()
 * 2. 서브 파일/디렉토리명: (업로드 중 깨짐 현상과 경로 구분자 중복 방지를 위해) 공백 없이 영어, 숫자, -_$만 쓸 것.
 * 3. 내용: 한 파일에는 여러 스크립트가 들어갈 수 있으며, 각 스크립트는 ScriptParser.areaWrapper 두 줄 사이에 있어야 한다.
 *         또한 해당 스크립트의 ID는 여는 부분의 areaWrapper 뒤에 붙여서 파일명과 똑같은 규칙을 따르도록 기입한다. ID가 없는 스크립트는 무시된다.
 * 4. 주소: getText(address)의 인자는 해당 스크립트의 고유한 주소로, 호출 시 반드시 요구된다. 최상위 폴더의 하위부터 폴더/.../파일/파일내 스크립트ID 로 자동 부여된다.
 * 5. 가변 인자: inspire-extension.String.format 규약에 맞춰 {인자명} 으로 중간에 넣는다. 어떤 인자명인지는 포맷팅하는 쪽(프레젠터)에서 결정.
 * 
 * @method getText(address) @returns {string}
 */

"use strict"
module.exports = (function(){
inspire('extension.String.format')

const ScriptParser = Object.seal({
    dir: null, // 반드시 설정한 후 사용할 것
    ext: ".txt",
    areaWrapper: "```",

    getDirectory(){ return this.dir },
    /** @param {string} dir 스크립트 파일들을 불러올 최상위 경로 */
    setDirectory(dir){
        this.dir = dir
    },

    // 확장자 interface
    getExtension(){ return this.ext },

    /** @param {string} id */
    checkID(id){ return /^[0-9A-z-_$]+$/.test(id) },

    /**
     * @param {string} base 원본 문자열
     * @returns {{id: string}}
     */
    $parse(base){
        base = base.split(/\s*\n/)
        const res = {}
        let txt = [], opened = false, id = null

        for(let line of base){
            if(opened){
                if(line === this.areaWrapper){
                    res[id] = txt.join('\n')
                    txt = []
                    opened = false
                    id = null
                } else {
                    txt.push(line)
                }
            } else if(line.startsWith(this.areaWrapper)) {
                id = line.slice(this.areaWrapper.length)
                if(this.checkID(id))
                    opened = true
                else
                    id = null
            }
        }

        return res
    },

    /**
     * @param {string} path ScriptParser.getDirectory() 를 기준으로 하위 경로
     * @returns {object?}
     */
    parse(path){
        const target = java.io.File(this.dir + '/' + path)
        assert(target.exists(), path + ` doesn't exist!`, 1)

        if(path.endsWith(this.ext) && target.isFile()){
            return this.$parse(FileStream.read(this.dir + '/' + path))
        } else { // case: directory
            const res = {}
            target.list().forEach(sub => res[sub] = this.parse(path + '/' + sub))
            return res
        }
    }
})


const ScriptManager = Object.seal({
    /** @public */
    OPTIMIZATION_DELAY: 10 * 60 * 1000, // ms
    SEPERATOR: '.',

    /** @private */
    opt_id: null,
    table: {},

    /**
     * @param {string?} dir 디렉토리 경로
     * 해당 디렉토리 하위 파일 전부 한꺼번에 불러옴
     */
    loadDir(dir){
        if(dir === void 0){
            dir = new java.io.File(ScriptParser.getDirectory())
            if(dir.isDirectory()) // 미지정 상태의 기본 최상위 경로만큼은 안전을 위해 있을 때만 로드
                dir.list().forEach(v => this.table[v] = ScriptParser.parse(v))
        } else {
            dir = dir.split(this.SEPERATOR)
            if(dir.length === 1){
                this.table[dir[0]] = ScriptParse.parse(dir[0])
            } else {
                let t = this.table
                dir.slice(0, -1).forEach(v => (v in t)? t[v]: (t[v] = {}))
                let k = dir[dir.length-1]
                t[k] = ScriptParser.parse(dir.join('/'))
            }
        }
    },

    /**
     * @param {string} add '파일' 경로
     * 
     * 파일 내용을 바꾼 뒤에 다시 할 수도 있기 때문에 기존 내용은 무시하고 덮어쓰기
     */
    loadFile(add){
        add = add.split(this.SEPERATOR)
        if(add.length === 1){
            this.table[add[0]] = ScriptParser.parse(add[0] + ScriptParser.getExtension())
        } else {
            let t = this.table
            add.slice(0, -1).forEach(v => t = (v in t)? t[v]: (t[v] = {}))
            let k = add[add.length-1]
            t[k] = ScriptParser.parse(add.join('/') + ScriptParser.getExtension())
        }
    },

    /**
     * @param {string} add address of the script
     * @returns {string}
     */
    getText(add){
        let p = add.split(this.SEPERATOR)
        assert(
            () => java.io.File(ScriptParser.getDirectory() + '/' + p.slice(0,-1).join('/') + ScriptParser.getExtension()).exists(),
            "script " + add + " doesn't exist! ",
            3
        )
        let t = this.table
        p.slice(0, -2).forEach(v => t = (v in t)? t[v]: (t[v] = {}))
        let k = p[p.length-2]
        if(!(k in t))
            this.loadFile(p.slice(0, -1).join(this.SEPERATOR))
        t = t[k][p[p.length-1]]
        if(t === void 0)
            assert(false, "script " + add + " doesn't exist in the file!", 3)
        return t
    },

    isOptimizing(){
        return this.opt_id !== null
    },

    /** @param {boolean} on */
    optimize(on){
        if(on){
            if(this.opt_id)
                clearInterval(this.opt_id)
            this.opt_id = setInterval(() => (this.table = {}, java.lang.System.gc()), this.OPTIMIZATION_DELAY)
        } else {
            if(this.opt_id)
                clearInterval(this.opt_id)
        }
    }
})


return { ScriptParser: ScriptParser, ScriptManager: ScriptManager }
})()