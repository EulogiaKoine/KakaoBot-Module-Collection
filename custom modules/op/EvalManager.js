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
 * @package EvalManager
 * @see KP.Message
 */



/**
 * @name EvalAdmin(ID)
 *  : 개인별 이발 권한 관리용 정적 클래스. 해시코드 등록은 필수이며, 추가로 방별 옵션을 지정할 수 있다.
 *  +readonly id: string -> 식별자
 *  +hashCodes: [string]  -> 무제한 수정 가능. 초기화 불가
 *  +rooms: [string]      -> 초기화 불가. 수정 가능.
 * > 이하 3개 메서드, 방 타입별 허용 여부 설정. 인자 없으면 현재 설정값 반환. 기본값 모두 true.
 *  +allowGroupChat: bool
 *  +allowDirectChat: bool
 *  +allowMultiChat: bool
 * > 이발 시 전역 객체 참조 허용 여부. false시 유지되는 개별 스코프를 부여받음
 *  +allowGlobalAccess: bool
 *  +personalScope: object    -> 기본값 빈 객체. 초기화 가능 객체 필드. 전역 권한 보유시 미사용.
 * > toObject(): { // 참조 끊김
 *      id: string,
 *      hashCode: [string],
 *      room: [string],
 *      allowance: {
 *          groupChat, directChat, multiChat, globalAccess: bool
 *      }
 * }
 * > 권한 확인 시 아래 함수 사용 권장(성능 이슈)
 *  +checkPermission(msg): bool    -> 해당 채팅자의 조건 확인.
 *      이후 O(1)로 확인 가능하도록 내부 배열 순서 최적화.
 * 
 * @name Evaluator
 *  : 명령어 실행자. 디버그룸은 그냥 됨.
 *  +prefix: string        -> 이발용 접두사. 1글자 이상일 것.
 *  +safeReplyName: string -> 이발에서 지원하는 메시지 전송 함수명
 *  +safeReplyCount: int   -> 이발에서 지원하는 메시지 전송의 최대횟수(음수면 0)
 *  +safeTimeout: int      -> 최대 이발 실행 허용시간(밀리초 고정)
 *  +admins: [EvalAdmin]       -> 이발을 사용 가능한 권한자 등록. 참조 유지, 초기화 비허용
 *  +freeRooms: [string] -> 권한 미보유자도 사용 가능한 방들. 참조 유지, 초기화 비허용
 *        단, 권한 미보유자에겐 매 실행마다 최소한의 스코프만 제공됨.
 *        유지되는 스코프나 전역 사용을 원한다면 권한을 부여할 것.
 *  +useNanoTime: bool -> 실행시간 측정 시 밀리초 대신 나노초 사용 여부
 *  +eval(msg, global: object)  -> msg 객체를 이용해 eval 실행.
 *        전역으로 취급될 객체 전달 필요.
 * > 디자인 관련
 *  +success_styler: fn(result, time{ms/ns}, msg)  -> 결과 출력 스타일링
 *  +error_styler: fn(error, msg)   -> 오류 출력 스타일링
 *  +timeout_styler: fn(msg)      -> 시간 초과 스타일링
 * 
 * @name EvalManager @extends Evaluator
 *  : 실행 기능에 권한 관리 파일로 관리하는 기능 추가
 *  +constructor(path)     -> 권한 정보를 저장할 파일 경로
 *  +load()                -> 저장된 정보 불러와서 적용
 *  +save()                -> 경로에 저장
 * 
 * EvalManager 파일 형식:
 * {
 *      prefix: string
 *      safeReplyName: string
 *      safeTimeout: int{ms}
 *      useNanoTime: bool
 *      freeRooms: [string]
 *      admins: [EvalAdmin.toObject(), ...]
 * }
 */

(function(){

var Message
try {
    Message = require('KP/Message')
    if(typeof Message !== "function")
        throw void 0;
} catch(e) {
    Log.e("EvalManager requires KP/Message class")
    throw new ReferenceError("EvalManager requires KP/Message class")
}


//------------------- EvalAdmin ---------------------
module.exports.EvalAdmin = EvalAdmin;

function EvalAdmin(id) {
    if (typeof id !== "string")
        throw new TypeError("EvalAdmin(id) - please input id of the admin");
    Object.defineProperty(this, "id", {
        value: id,
        writable: false
    });
    this.$hc = [];
    this.$rm = [];
    // 채팅방 허용 조건(all 기본 true)
    this.$ag = true; // allowGroupChat
    this.$ad = true; // allowDirectChat
    this.$am = true; // allowMultiChat
    // 이발 시 사용 스코프 관련 권한 및 데이터
    this.$ga = true; // allowGlobalAccess
    this.$ps = {};   // personal scope
}

// 해시, 방
Object.defineProperty(EvalAdmin.prototype, "hashCodes", {
    get: function() {
        return this.$hc;
    },
    enumerable: true
});
Object.defineProperty(EvalAdmin.prototype, "rooms", {
    get: function() {
        return this.$rm;
    },
    enumerable: true
});

// 방 속성s
Object.defineProperty(EvalAdmin.prototype, "allowGroupChat", {
    get: function() {
        return this.$ag;
    },
    set: function(option) {
        this.$ag = !!option;
    },
    enumerable: true
});
Object.defineProperty(EvalAdmin.prototype, "allowDirectChat", {
    get: function() {
        return this.$ad;
    },
    set: function(option) {
        this.$ad = !!option;
    },
    enumerable: true
});
Object.defineProperty(EvalAdmin.prototype, "allowMultiChat", {
    get: function() {
        return this.$am;
    },
    set: function(option) {
        this.$am = !!option;
    },
    enumerable: true
});

// 전역 권한 + 스코프
Object.defineProperty(EvalAdmin.prototype, "allowGlobalAccess", {
    get: function() {
        return this.$ga;
    },
    set: function(option) {
        this.$ga = !!option;
    },
    enumerable: true
});
Object.defineProperty(EvalAdmin.prototype, "personalScope", {
    get(){ return this.$ps; },
    set(s){
        if(typeof s === "object")
            this.$ps = s
        else
            throw new TypeError("scope must be an object")
    }
})

// checkPermission: msg가 Message 클래스의 인스턴스임을 전제로 해시와 방 목록에서 조건 확인
EvalAdmin.prototype.checkPermission = function(msg) {
    if (!(msg instanceof Message))
        throw new TypeError("message object must instance of KP/Message class");

    // 1. 해시 검사
    var idx = this.$hc.indexOf(msg.profileHash);
    if (idx === -1)
        return false;
    // 최적화를 위해 찾은 해시를 배열의 맨 앞으로 스왑
    if (idx !== 0) {
        var tmp = this.$hc[0];
        this.$hc[idx] = this.$hc[0]
        this.$hc[0] = msg.profileHash;
    }

    // 2. 방 검사: msg.room이 등록되어 있다면 배열 최적화 후 true 반환
    idx = this.$rm.indexOf(msg.room);
    if (idx !== -1) {
        if (idx !== 0) {
            this.$rm[idx] = this.$rm[0]
            this.$rm[0] = msg.room
        }
        return true;
    }

    // 3. 채팅 종류에 따른 조건 검사
    return (!msg.isGroupChat || this.$ag) &&
           (msg.isGroupChat || this.$ad) &&
           (!msg.isMultiChat || this.$am);
};

// 퓨어 객체로 복사
EvalAdmin.prototype.toObject = function() {
    return {
        id: this.id,
        hashCodes: this.$hc.slice(),
        rooms: this.$rm.slice(),
        allowance: {
            groupChat: this.$ag,
            directChat: this.$ad,
            multiChat: this.$am,
            globalAccess: this.$ga
        }
    };
};
//------------------- EvalAdmin ---------------------



//------------------- Evaluator ---------------------
var now = java.lang.System.currentTimeMillis
var nanoTime = java.lang.System.nanoTime
var Context = org.mozilla.javascript.Context
var TimeUnit = java.util.concurrent.TimeUnit
var TimeoutException = java.util.concurrent.TimeoutException
var RhinoException = org.mozilla.javascript.RhinoException



module.exports.Evaluator = Evaluator;

// constants
Evaluator.THREADPOOL_CORESIZE = 1;
Evaluator.THREADPOOL_MAXSIZE = java.lang.Runtime.getRuntime().availableProcessors() / 2 >> 0;
Evaluator.ALIVE_TIME = 2; // Minute
Evaluator.MAX_STACK_DEPTH = 1000;
Evaluator.MIN_TIMEOUT = 500  // 최소 허용치

Evaluator.TIMEOUT_ERROR_NAME = "TimeoutError";
Evaluator.SCRIPT_NAME = "op.Evaluator"


function Evaluator(){
    this.$prf = 'e'   // prefix
    this.$srn = 'rp'  // safe reply name
    this.$src = 10    // safe reply count
    this.$sto = 10000 // safe timeout

    this.$ads = []    // EvalAdmin[]
    this.$frs = []    // 자유 이발 방들

    this.$uns = false // 이발 동작시각으로 나노초(ns) 사용 여부

    this.$ssf = Evaluator.success_styler // 성공 시 결과 가공 함수
    this.$esf = Evaluator.error_styler   // 실패 시 결과 가공 함수
    this.$tsf = Evaluator.timeout_styler // 시간 초과 시 결과 가공 함수

    // 세이프이발용 스레드풀 실행자
    this.$exe = new java.util.concurrent.ThreadPoolExecutor(
        Evaluator.THREADPOOL_CORESIZE, Evaluator.THREADPOOL_MAXSIZE,
        Evaluator.ALIVE_TIME, java.util.concurrent.TimeUnit.MINUTES,
        new java.util.concurrent.LinkedBlockingQueue()
    );

    // 컴파일 시 스레드풀 소멸 요청
    BotManager?.getCurrentBot().addListener(Event.START_COMPILE, () => this.$exe.shutdown())
}

Evaluator.success_styler = function(result, timeout, msg){
    return "⏱˚ " + timeout + " sec.\n" + result;
}
Evaluator.error_styler = function(error, timeout, msg){
    return "☢ " + error.name + "   ··· " + error.lineNumber
        + "\n" + error.message
        + "\u200b".repeat(500)
        + "\n" + error.stack;
}
Evaluator.timeout_styler = function(timeout, msg){
    return "⛔OverTime(> " + timeout + " sec.) Warning!"
        + "\n- Execution has been forcibly terminated due to a timeout." 
}


Object.defineProperty(Evaluator.prototype, 'prefix', {
    get(){ return this.$prf },
    set(v){
        if(typeof v === "string" && v.length !== 0)
            this.$prf = v
        else
            throw new TypeError("evaluator prefix must be a string longer than length 1")
    },
    enumerable: true
})
Object.defineProperty(Evaluator.prototype, 'safeReplyName', {
    get(){
        return this.$srn
    },
    set(v){
        if(typeof v === "string" && v.length !== 0)
            this.$srn = v
        else
            throw new TypeError("safe reply function name must be a string longer than length 1")
    },
    enumerable: true
})
Object.defineProperty(Evaluator.prototype, 'safeReplyCount', {
    get(){ return this.$src; },
    set(c){ this.$src = Math.max(0, c >> 0); },
    enumerable: true
})

Object.defineProperty(Evaluator.prototype, 'safeTimeout', {
    get(){ return this.$sto; },
    set(c){
        this.$sto = Math.max(Evaluator.MIN_TIMEOUT, c >> 0);
        // this.$tcf.setTimeout(this.$sto)
    },
    enumerable: true
})

// admins끼리 해시는 각각 겹치지 않아야 함.
Object.defineProperty(Evaluator.prototype, 'admins', {
    get(){ return this.$ads; },
    enumerable: true
})
Object.defineProperty(Evaluator.prototype, 'freeRooms', {
    get(){ return this.$frs; },
    enumerable: true
})

Object.defineProperty(Evaluator.prototype, 'useNanoTime', {
    get(){ return this.$uns; },
    set(v){ this.$uns = !!v; },
    enumerable: true
})

Object.defineProperty(Evaluator.prototype, 'success_styler', {
    get(){ return this.$ssf; },
    set(fn){
        if(typeof fn === "function" && fn.arity === 3)
            this.$ssf = fn
        else
            throw new TypeError("evaluator succes_styler must have 3 parameters: (result, executed time, msg)")
    }
})
Object.defineProperty(Evaluator.prototype, 'error_styler', {
    get(){ return this.$ssf; },
    set(fn){
        if(typeof fn === "function" && fn.arity === 3)
            this.$esf = fn
        else
            throw new TypeError("evaluator succes_styler must have 3 parameters: (error, executed time, msg)")
    }
})
Object.defineProperty(Evaluator.prototype, 'timeout_styler', {
    get(){ return this.$ssf; },
    set(fn){
        if(typeof fn === "function" && fn.arity === 2)
            this.$tsf = fn
        else
            throw new TypeError("evaluator succes_styler must have 2 parameter: (safeTimeout, msg)")
    }
})

// replier 함수 제작
/** @param {KP.Message} msg */
Evaluator.prototype.constructReply = function(msg){
    var i = this.$src
    return (a, b) => {
        if(i === 0)
            return false;
        i--;
        if(b === void 0)
            return msg.reply(a)
        return msg.reply(a, b)
    }
}
// Runnable 객체 생성
var Runnable = java.lang.Runnable
Evaluator.prototype.runner = function(scope$$, script$$, record$$){
    var rcd = this.$uns? nanoTime: now;
    var unit = this.$uns? 1e9: 1e3;
    return new Runnable({ run(){
        var cx = Context.enter();
        cx.setOptimizationLevel(-1);
        cx.setMaximumInterpreterStackDepth(Evaluator.MAX_STACK_DEPTH);

        // 시간 기록용
        var start;
        try {
            start = rcd();
            record$$.result = cx.evaluateString(scope$$, script$$, Evaluator.SCRIPT_NAME, 1, null);
            record$$.time = (rcd() - start) / unit;
        } catch(e){
            record$$.time = (rcd() - start) / unit;
            if(e instanceof RhinoException)
                record$$.errorLine = e.lineNumber()
            else
                record$$.errorLine = e.lineNumber
            throw e
        } finally {
            if(record$$.time === 0)
                record$$.time = (rcd() - start) / unit;
            Context.exit();
        }
    } });
}

var Context = org.mozilla.javascript.Context
/**
 * @param {KP.Message} msg 
 * @param {object} globalScope 
 */
Evaluator.prototype.eval = function(msg /* KP.MESSAGE */, globalScope){
    // 제0목표: 오류 통제
    // 제1목표: 성능
    // 제2목표: 정확성
    // 이를 위해선 가독성따위

    // 1. 접두사 검사
    if(msg.content.startsWith(this.$prf)){
        // 2. 개별 권한 검사
        var user$$ = this.$ads.find(a => a instanceof EvalAdmin && a.checkPermission(msg))
        // 3. 개인 권한이 없다면 방 검사
        if(user$$ === void 0 && this.$frs.indexOf(msg.room) === -1)
            return; // 보낸사람도, 해당 방에도 권한이 없다면 그냥 종료

        // 실행 스코프
        var scope$$;
        if(user$$ === void 0) // 방에는 권한이 있어도 등록된 개인 정보가 없다면
            scope$$ = {}; // 임시 스코프만 제공.
        else if(user$$.allowGlobalAccess)
            scope$$ = globalScope;
        else
            scope$$ = user$$.personalScope;
        if(typeof scope$$ !== "object")
            scope = {}
        // 답장 함수 스코프에 등록(전역이라면 좀 불안하긴 한데, 일단 테스트 먼저 하고...)
        scope$$[this.$srn] = this.constructReply(msg);

        // 기록용 참조
        var record$$ = {
            time: 0, result: null
        }

        // 4. 실행
        var code$$ = msg.content.slice(this.$prf.length);
        var future$$ = this.$exe.submit(this.runner(scope$$, code$$, record$$));

        try {
            future$$.get(this.$sto, TimeUnit.MILLISECONDS);
            msg.reply(this.$ssf(record$$.result, record$$.time, msg));
        } catch(e) {
            // JavaExceptino 파싱
            var err;
            if(e instanceof JavaException){
                err = e;
                err = e.message.split(": ").slice(-2);
                err.push(e.stack);
                e = new Error(err[1]);
                e.name = err[0];
            }
            if(e.name === "java.util.concurrent.TimeoutException" || e instanceof TimeoutException){
                msg.reply(this.$tsf(record$$.time>0? record$$.time: (this.$sto/1e3), msg));
            } else  {
                e.stack = err[2]
                    .split('\n').filter(v => v.indexOf('op/EvalManager.js') === -1).join('\n');
                e.lineNumber = record$$.errorLine;
                msg.reply(this.$esf(e, record$$.time, msg));
            }
        } finally {
            // (무한루프 포함) 태스크 강제종료
            future$$.cancel(true);
        }
    }
}
//------------------- Evaluator ---------------------



//------------------- EvalManager ---------------------
module.exports.EvalManager = EvalManager

function EvalManager(save_path){
    if(typeof save_path !== "string")
        throw new TypeError("EvalManager(filepath) - path must be a string");

    Evaluator.call(this);
    Object.defineProperty(this, 'filepath', {
        value: save_path,
        enumerable: true,
        configurable: true
    });
}
Object.setPrototypeOf(EvalManager, Evaluator);
Object.setPrototypeOf(EvalManager.prototype, Evaluator.prototype);


EvalManager.prototype.toObject = function(){
    return {
        prefix: this.$prf,
        safeReplyName: this.$srn,
        safeReplyCount: this.$src,
        safeTimeout: this.$sto,
        useNanoTime: this.$uns,
        freeRooms: this.$frs.filter(v => typeof v === "string"),
        admins: this.$ads.filter(v => v instanceof EvalAdmin)
            .map(v => v.toObject())
        /* styler 함수들은 재등록 필요(내부 참조가 있을 수도 있어서) */
    };
}

EvalManager.prototype.load = function(){
    if(!java.io.File(this.filepath).exists())
        throw new ReferenceError("file " + this.filepath + " not found.");

    var file = FileStream.read(this.filepath);
    try {
        file = JSON.parse(file);
    } catch(e) {
        throw new SyntaxError("eval configuration file " + this.filepath + " must be written as JSON");
    }

    if(typeof file.prefix === "string")
        this.$prf = file.prefix;
    if(typeof file.safeReplyName === "string")
        this.$srn = file.safeReplyName;
    if(typeof file.safeReplyCount === "number")
        this.$src = file.safeReplyCount;
    if(typeof file.safeTimeout === "number")
        this.$sto = file.safeTimeout;
    if(typeof file.useNanoTime === "boolean")
        this.$uns = file.useNanoTime;
    if(Array.isArray(file.freeRooms))
        this.$frs = file.freeRooms.filter(v => typeof v === "string");
    if(Array.isArray(file.admins)){
        var admin;
        this.$ads = file.admins.filter(v => typeof v === "object" && typeof v.id === "string")
            .map(data => {
                admin = new EvalAdmin(data.id);
                data.hashCodes?.forEach(hash => {
                    if(typeof hash === "number")
                        admin.hashCodes.push(hash);
                })
                data.rooms?.forEach(hash => {
                    if(typeof hash === "string")
                        admin.rooms.push(hash);
                })
                if(typeof data.allowance?.groupChat === "boolean")
                    admin.allowGroupChat = data.allowance.groupChat;
                if(typeof data.allowance?.directChat === "boolean")
                    admin.allowDirectChat = data.allowance.directChat;
                if(typeof data.allowance?.multiChat === "boolean")
                    admin.allowDirectChat = data.allowance.multiChat;
                if(typeof data.allowance?.globalAccess === "boolean")
                    admin.allowGlobalAccess = data.allowance.globalAccess;
                return admin
            });
    }
}

EvalManager.INDENT_SPACES = 4;
EvalManager.prototype.save = function(){
    FileStream.write(
        this.filepath,
        JSON.stringify(this.toObject(), null, EvalManager.INDENT_SPACES)
    )
}


//------------------- EvalManager ---------------------




})()