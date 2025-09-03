importClass(java.io.File);
require('inspire')(this);
inspire('util.File');
const load = '/storage/emulated/0/믱봇/LasVegas/user';
const space = "​".repeat(500);
const workingSpaces = [18394379714609870];
const giveCoinCMD = '.송금 ';
function responseFix(room, msg, sender, isGroupChat, replier, imageDB, packageName, xxx, userId2, roomId, userId3, msgId, hasMention, isMultiChat, mention, dS) {
  const userFile = new File(load + '/' +roomId+'/'+ userId3+'.json',true);
  if (workingSpaces.includes(roomId)) {
    if (userFile.exists == false) {
      userFile.create();
      userFile.write(JSON.stringify({
  name: sender, 
  id: userId3, 
  recentChat: msg, 
  chatCounts: 1, 
  coins: 0}));
    }
    const user = userFile.read();
    if (user) {
      if (user.chatCounts < 100) {
      } else if (Number(user.chatCounts) >= 100) {
        user.chatCounts = Number(user.chatCounts) - 100;
        user.coins = Number(user.coins) + 600;
        replier.reply('《' + sender + '》님의 루블: ' + (Number(user.coins)) + '(+600루블)');
      }
    }
    if (user) {
      if (user.name != sender) {
        user.name = sender;
      }
    }
    if (user) {
      if (msg == '.계좌') {
        replier.reply('〈' + user.name + '님의 계좌〉\n✱ 주인 :: ' + user.name + '\n✱ 아이디 :: ' + userId3 + '\n✱ 통장 :: $' + user.coins + '\n✱ 포커칩 :: ◎' + user.coins + '\n*채팅수 :: (' + user.chatCounts + '/100)\n〖 ❖ 𝐋𝐚𝐬 𝐕𝐞𝐠𝐚𝐬 𝐂𝐚𝐬𝐢𝐧𝐨 𝐁𝐚𝐧𝐤 〗');
      }
      if (msg === '.파친코') {
        let [a, b, c] = [0, 0, 0].map(() =>  ['🍎', '🍋','🍌','🥭','🍓','🍅','🥥','🫒','🍏','🍐','🍒','🥝','🍊', '🍍', '🍈', '🫐', '🍇', '🍑'][Math.random() * 18 >> 0]);
        var result;
        if (user.coins < 900) {
          replier.reply('루블이 부족합니다.');
        } else {
          user.coins -= 900;
          if (a === b && b === c) {
            result = '성공';
            user.coins += 777777;
            replier.reply('【' + sender + '님의 결과】\n\n ,______,•------•,_______,\n |🟥🟥 _-' + result + '-_🟥🟥|\n |🟥🟥🟥🟥🟥🟥🟥|\n |🟥■■■■■■ 🟥|\n |🟥■' + a + '|' + b + '|' + c + '■🟥|  🔴\n |🟥■■■■■■ 🟥| //\n |🟥🟥🟥🟥🟥🟥🟥|//\n/🟥🟥🟥🟥🟥🟥🟥\\\n||🟥🟥🟥🟥🟥🟥🟥||\n||🟥🟥🟥🟥🟥🟥🟥||\n￣￣￣￣￣￣￣￣￣￣\n\n777,777루블 당첨!');
          } else {
            result = '실패';
            replier.reply('【' + sender + '님의 결과】\n\n ,______,•------•,_______,\n |🟥🟥 _-' + result + '-_🟥🟥|\n |🟥🟥🟥🟥🟥🟥🟥|\n |🟥■■■■■■ 🟥|\n |🟥■' + a + '|' + b + '|' + c + '■🟥|  🔴\n |🟥■■■■■■ 🟥| //\n |🟥🟥🟥🟥🟥🟥🟥|//\n/🟥🟥🟥🟥🟥🟥🟥\\\n||🟥🟥🟥🟥🟥🟥🟥||\n||🟥🟥🟥🟥🟥🟥🟥||\n￣￣￣￣￣￣￣￣￣￣');
          }
        }
      }
      if (msg.startsWith('.유저 ')) {
        if (hasMention) {
          replier.reply('〔시간이 걸릴 수 있습니다..〕');
          replier.reply('〔유저목록〕' + space + '\n\n' + userFind(msg.slice(5).trim()));
        } else {
          replier.reply('〔시간이 걸릴 수 있습니다..〕');
          replier.reply('〔유저목록〕' + space + '\n\n' + userFind(msg.slice(4)));
        }
      }
      if (msg.startsWith(".송금 ")) {
        if (user) {
          let b = msg.split(" ")[2];
          let a = msg.split(" ")[1].replace(" " + b, "");
          let d = user.coins;
          let target = JSON.parse(fs.read(load + '/' + a + '.json'));
          if (isNaN(b)) {
            replier.reply('〔.송금 [아이디] [돈] 형태로 보내주세요.〕');
            save();
          } else if (!target) {
            replier.reply('〔해당 아이디를 찾을 수 없습니다.〕');
            save();
          } else if (d < Number(b)) {
            replier.reply('〔돈이 부족합니다.〕');
            save();
          } else if (Number(b) <= 0) {
            replier.reply('〔루블을 1루블 이상만 보낼 수 있습니다.〕');
            save();
          } else {
            replier.reply('〔' + user.name + '님이 ' + target.name + '님에게 ' + (b) + '루블을 보내셨습니다.〕');
            user.coins = (Number(user.coins) - Number(b));
            target.coins = (Number(target.coins) + Number(b));
            fs.write(load + '/' + a + '.json', JSON.stringify(target));
          }
          save();
          fs.write(load + '/' + a + '.json', JSON.stringify(target));
        } else {
          replier.reply('〔가입해주세요.〕');
          save();
        }
      }
      function save() {
        if (user) {
          fs.write(userPath, JSON.stringify(user));
        }
      }      user.chatCounts++;
      user.recentChat = msg;
      save();
    }
  }
function matchUsers(target, arr) {
  let result = [];
  var userLoad = new java.io.File(arr);
  for (e of userLoad.list()) {
    if (e.endsWith('.json') && new java.io.File(userLoad, e).isFile()) {
      let last = JSON.parse(fs.read(folderPath + '/' + e));
      result.push({
  name: target.name, 
  id: targetid, 
  coin: target.coin});
    }
  }
  return result;
}
function loadAllUsers(folderPath) {
  var userList = [];
  var userLoad = new java.io.File(folderPath);
  for (e of userLoad.list()) {
    if (e.endsWith('.json') && new java.io.File(userLoad, e).isFile()) {
      userList.push(JSON.parse(fs.read(folderPath + '/' + e)));
    }
  }
  return userList;
}
function userFind(name) {
  var player = loadAllUsers('sdcard/chatBots/user/'+roomId);
  var value = [];
  var names = player.map(v => v.name);
  var id = player.map(v => v.id);
  var count = player.map(v => v.chatCounts);
  var reason = player.map(v => v.coins);
  var recentChat = player.map(v => v.recentChat);
  for (e = 0; e < player.length; e++) {
    if (names[e].includes(name)) {
      value.push((value.length + 1) + '. ' + names[e] + ' | 최근 채팅:' + recentChat[e] + '\n(ID:' + id[e] + ') | 루블: ' + reason[e] + '\n채팅수: (' + count[e] + '/100)\n\n');
    }
  }
  return value.join('\n');
}
if (msg.startsWith(".lv")) {
    try {
      replier.reply(eval(msg.substr(3)));
    }    catch (e) {
  replier.reply(e);
}
}
}
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
