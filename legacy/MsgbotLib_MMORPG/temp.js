// ------------- 기본 세팅 -------------
require('inspire')(this);
inspire('util.File');               // 효율적인 파일 관리용 클래스
inspire('extension.String.format')  // 문자열.format(...) : 문자열 포맷
inspire('extension.Object.values')  // Object.values(객체) : 객체의 값 배열을 반환
inspire('extension.Array.random')   // 배열.random() : 랜덤 요소 하나 뽑기

// util.File이 안전하게 작동할 수 있게 보조
function onStartCompile(){
    ThreadManager.stopAll()
}
// --------------- 기본 세팅 ----------------



// -------------- 데이터 관리 ---------------
const SD = '/storage/emulated/0'
const DATA_PATH = SD + '/믱봇/LasVegas'
const USER = DATA_PATH + '/user'
const space = "\u200b".repeat(500);
const workingSpaces = ["18394379714609870"];

const UserManager = {
    cache: {}, // 메모리 상의 임시 유저데이터 저장공간

    // userId로 해당 유저 정보가 저장된 파일 경로를 생성한다.
    makePath(userId){
        return USER + '/' + userId + '.json'
    },

    // 해당 userId를 가진 유저가 존재하는지 확인한다
    exists(userId){
        return userId in this.cache
    },

    // 해당 userId의 유저 정보를 가져온다. 없거나, load가 실행된 적이 없을 경우 null 반환.
    getUser(userId){
        if(this.exists(userId))
           return this.cache[userId].read()

        return null // 없을 경우다.
    },

    // 해당 userId의 유저 정보를 저장소에 저장한다. 심심하면 써도 된다.
    saveUser(userId){
        if(this.exists(userId))
            this.cache[userId].save()
    },

    // 해당 roomId에 해당하는 sdcard 상의 유저 데이터를 불러와 cache 에 util.File 객체로 저장한다.
    // 기존에 저장된 데이터는 초기화되니 주의.
    loadAllUsers(){
        const folder = new java.io.File(USER)
        for(let file of folder.list()){ // roomId에 해당하는 폴더 내 모든 파일에 대해
            if(file.endsWith('.json') && new java.io.File(folder, file).isFile()){ // JSON 파일일 경우
                let userFile = new File(USER + '/' + file, true)
                userFile.load()
                let userId = file.replace(/.json$/, '') // 끝에 있는 .json 파일 형식 없앤 거 == userId
                this.cache[userId] = userFile
            }
        }
    },

    // 해당 roomId와 userId로 새 유저를 추가한다. 기존에 존재할 경우 오류를 터뜨리니 조심하자.
    register(userId, name){
        if(this.exists(userId)) // 이미 존재하면
            throw new Error("userId={0} 인 유저는 이미 존재합니다!".format(userId))

        // 유저 틀
        const user = {
            name: name,
            id: userId,
            recentChat: null,
            chatCounts: 1,
            coins: 0
        }

        const userFile = new File(this.makePath(userId), true)
        userFile.write(user)
        userFile.save()

        this.cache[userId] = userFile
    },

    // 유저 객체 배열 반환
    userList(){
        return Object.values(this.cache).map(v => v.read())
    }
}

UserManager.loadAllUsers() // 이후 또 실행할 필요는 사실상 없다.
// ------------- 데이터 관리 -------------


// ------------- 상수 관리 -------------
const CHAT_COIN_BONUS = 600 // 채팅 100회마다 주는 루블 양

const PACHINKO_COST = 900 // 파친코 1회 돌리는 가격(루블)
const PACHINKO_REWARD = 777777 // 파친코 보상(루블)
const PACHINKO_FRUITS = ['🍎', '🍋','🍌','🥭','🍓','🍅','🥥','🫒','🍏','🍐','🍒','🥝','🍊', '🍍', '🍈', '🫐', '🍇', '🍑'] // 파친코에 등장하는 과일(이 중 하나가 랜덤으로 나옴)
const PACHINKO_FRAME =
    '【{userName}님의 결과】'
    + '\n\n ,______,•------•,_______,'
    + '\n |🟥🟥 _-{result}-_🟥🟥|'
    + '\n |🟥🟥🟥🟥🟥🟥🟥|'
    + '\n |🟥■■■■■■ 🟥|'
    + '\n |🟥■{a}|{b}|{c}■🟥|  🔴'
    + '\n |🟥■■■■■■ 🟥| //'
    + '\n |🟥🟥🟥🟥🟥🟥🟥|//'
    + '\n/🟥🟥🟥🟥🟥🟥🟥\\'
    + '\n||🟥🟥🟥🟥🟥🟥🟥||'
    + '\n||🟥🟥🟥🟥🟥🟥🟥||'
// ------------- 상수 관리 -------------




// ---------------------------------------
// ------------- 명령어 관리 --------------
// ---------------------------------------
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, xxx, userId2, roomId, userId3, msgId, hasMention, isMultiChat, mention, dS) {
  // 등록된 방이 아닐 경우 그냥 함수를 종료시켜버리기. 깔끔하게.
  if(!workingSpaces.includes(roomId)) return

  // 없는 유저면 새로 등록
  if(!UserManager.exists(userId3)){
    UserManager.register(userId3, sender)
    UserManager.saveUser(userId3)
  }

  // 위에서 '없으면 등록' 했기 때문에, 사실상 user는 반드시 객체일 수밖에 없다.
  const user = UserManager.getUser(userId3)

  user.name = sender // 유저 이름이 항상 보낸사람 이름이 되도록 갱신
  user.recentChat = msg // 가장 마지막에 친 채팅 저장
  user.chatCounts++ // 채팅 횟수 1회 추가


  // 채팅 횟수에 따른 처리
  if(user.chatCounts < 100){
    // 미정
  } else { // user.chatCounts >= 100과 동일함.
    user.chatCounts -= 100 // 채팅 횟수 100 빼고
    user.coins += CHAT_COIN_BONUS // 코인(루블) 추가
    replier.reply('《' + sender + '》님의 루블: ' + user.coins + '(+' + CHAT_COIN_BONUS + '루블)')
  }


  // 명령어: 계좌
  if(msg === ".계좌"){
    replier.reply(
          '〈' + user.name + '님의 계좌〉'
        + '\n✱ 주인 :: ' + user.name
        + '\n✱ 아이디 :: ' + userId3
        + '\n✱ 통장 :: $' + user.coins
        + '\n✱ 포커칩 :: ◎' + user.coins
        + '\n*채팅수 :: (' + user.chatCounts + '/100)'
        + '\n〖 ❖ 𝐋𝐚𝐬 𝐕𝐞𝐠𝐚𝐬 𝐂𝐚𝐬𝐢𝐧𝐨 𝐁𝐚𝐧𝐤 〗'
    )
  }
  // 명령어: 계좌


  // 명령어: 파친코
  if(msg === ".파친코"){
    if (user.coins < PACHINKO_COST) {
        replier.reply('루블이 부족합니다.');
    } else {
        user.coins -= PACHINKO_COST // 비용은 선불

        // 과일 3개 랜덤으로 뽑음
        let [a, b, c] = [0, 0, 0].map(() => PACHINKO_FRUITS.random());

        // 성공
        if (a === b && b === c) {
            user.coins += PACHINKO_REWARD;
            replier.reply(
                PACHINKO_FRAME.format({
                    userName: sender,
                    result: "성공",
                    a: a, b: b, c: c
                })
                + '\n\n\n' + PACHINKO_REWARD + '루블 당첨!'
            )
        } else { // 실패
            replier.reply(
                PACHINKO_FRAME.format({
                    userName: sender,
                    result: "실패",
                    a: a, b: b, c: c
                })
            )
        }
    }
  }
  // 명령어: 파친코


  // 명렁어: 유저
  if(msg.startsWith('.유저 ')){
    let keyword = msg.slice(hasMention? 5: 4).trim()
    replier.reply(
        '〔유저목록〕' + space
        + '\n\n'
        + UserManager.userList().filter(v => v.name.includes(keyword)).map(
            (user, index) => (index+1) + '. ' + user.name + ' | 최근 채팅:' + user.recentChat
            + '\n(ID:' + user.id + ') | 루블: ' + user.coins
            + '\n채팅수: (' + user.chatCounts + '/100)'
        ).join('\n\n\n')
    )
  }
  // 명령어: 유저


  // 명령어: 송금
  if(msg.startsWith(".송금 ")){
    let cmd = msg.slice(4).trim().split(' ')
    let targetId = cmd[0] // 아이디
    let amount = Math.floor(cmd[1]) // 돈

    if(isNaN(amount)) // 입력한 돈이 숫자가 아니면
        replier.reply('〔.송금 [아이디] [돈] 형태로 보내주세요.〕')
    else if(!UserManager.exists(targetId))
        replier.reply('〔해당 아이디를 찾을 수 없습니다.〕')
    else if(amount < 1)
        replier.reply('〔루블을 1루블 이상만 보낼 수 있습니다.〕')
    else if(user.coins < amount)
        replier.reply('〔돈이 부족합니다.〕')
    else {
        let target = UserManager.getUser(targetId)
        // 코인 추가
        user.coins -= amount
        target.coins += amount
        replier.reply('〔' + user.name + '님이 ' + target.name + '님에게 ' + amount + '루블을 보내셨습니다.〕')
    }
  }
  // 명령어: 송금



  // 유저 정보 폰에 저장
  UserManager.saveUser(userId3)
}





// 안드로이드 11 이상 카톡 알림 대응 소스
function onNotificationPosted(sbn, sm) {
  var packageName = sbn.getPackageName();
  if (!packageName.startsWith("com.kakao.tal")) 
    return;
  var actions = sbn.getNotification().actions;
  if (actions == null) 
    return;
  var userId = sbn.getUser().hashCode();
  for (var n = 0; n < actions.length; n++) {
    var action = actions[n];
    if (action.getRemoteInputs() == null) 
      continue;
    var bundle = sbn.getNotification().extras;
    var userId2 = bundle.get("android.messages")[0].get("sender_person").key;
    var roomId = sbn.getNotification().shortcutId;
    var userId3 = java.lang.String(userId2 + roomId).hashCode();
    var msg = bundle.get("android.text").toString();
    var sender = bundle.getString("android.title");
    var room = bundle.getString("android.subText");
    if (room == null) 
      room = bundle.getString("android.summaryText");
    var isGroupChat = room != null;
    if (room == null) 
      room = sender;
    var replier = new com.xfl.msgbot.script.api.legacy.SessionCacheReplier(packageName, action, room, false, "");
    var msgId = sbn.getNotification().getSortKey;
    const e = sbn.getNotification().extras;
    const SpannableString = android.text.SpannableString;
    var hasMention = (e.get("android.text") || e.getParcelableArray("android.messages")[0].get("text")) instanceof SpannableString;
    var isMultiChat = sbn.getUser().hashCode() !== 0;
    var icon = bundle.getParcelableArray("android.messages")[0].get("sender_person").getIcon().getBitmap();
    var image = bundle.getBundle("android.wearable.EXTENSIONS");
    if (image != null) 
      image = image.getParcelable("background");
    var imageDB = new com.xfl.msgbot.script.api.legacy.ImageDB(icon, image);
    var user = [];
    var mention = [];
    try {
      user = JSON.parse(FileStream.read('/sdcard/user.txt'));
    }    catch (e) {
  user = null;
}
    if (user == null) 
      user = [];
    if (!user.includes(sender)) {
      user.push(sender);
      FileStream.write('/sdcard/user.txt', JSON.stringify(user));
    }
    if (hasMention) {
      for (var i = 1; i < user.length + 1; i++) {
        if (msg.split('@')[1].includes(user[i])) {
          try {
            mention.push(user[i]);
          }          catch (e) {
}
        }
      }
    }
    var now = new Date();
    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString().padStart(2, "0");
    var day = now.getDate().toString().padStart(2, "0");
    var h = now.getHours().toString().padStart(2, "0");
    var m = now.getMinutes().toString().padStart(2, "0");
    var s = now.getSeconds().toString().padStart(2, "0");
    var ms = now.getMilliseconds().toString().padStart(3, "0");
    var dS = year + "." + month + "." + day + "  " + h + ":" + m + ":" + s + " " + ms + "ms";
    com.xfl.msgbot.application.service.NotificationListener.Companion.setSession(packageName, room, action);
    if (this.hasOwnProperty("responseFix")) {
      responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, userId != 0, userId2, roomId, userId3, msgId, hasMention, isMultiChat, mention, dS);
    }
  }
}
/**
 * Created by naijun on 2022/02/23
 * Copyright (c) naijun.
 * This code is licensed under the MIT Licensing Principles.
 */
