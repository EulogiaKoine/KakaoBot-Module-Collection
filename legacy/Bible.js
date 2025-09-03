/**
 * @version {2024.07.15} 1.0.0
 * @see org.jsoup.Jsoup
 * @environment RhinoJS
 */

"use strict"
module.exports = (function(){



/**
 * @param {string} s original string
 * @param {object?} m arguments
 * @returns {string} formatted result
 */
function format(s, m) {
    if (typeof m === "object") {
        for (let key in m) {
            s = s.replace(new RegExp("{" + key + "}", "g"), m[key]);
        }
        return s;
    }
    let i = 0;
    while (i in arguments) {
        s = s.replace(new RegExp("{" + i + "}", "g"), arguments[i++]);
    }
    return s;
}

function Bible(){
    if(this instanceof Bible)
        throw new Error("class Bible is static; cannot used be a constructor");
}
Bible.toString = () =>
         "static class Bible {"
    + "\n  VERSE_API_FORMAT: string"
    + "\n  BookCode: {string: string}"
    + "\n  formatVerseURL(string book, number chapter): string"
    + "\n  requestVerse(string book, number chapter): HTMLDocument"
    + "\n  getVerse(string book, number chapter): [message: string]"
    + "\n"
    + "\n  HYMN_API_FORMAT: string"
    + "\n  formatHymnURL(number hymnCode): string"
    + "\n  requestHymn(number hymnCode): HTMLDocument"
    + "\n  getHymn(number hymnCode): {"
    + "\n    title: string,"
    + "\n    content: [{part: string, lyrics: string}]"
    + "\n  }"
    + "\n  stringifyHymn(result of getHymn, number? hymnCode): string"
    + "\n}"


Bible.VERSE_API_FORMAT = "http://goodtvbible.com/bible.asp?bible_idx={book}&jang_idx={chapter}&bible_version_1=2"
Bible.BookCode = {
    "창세기": "1",
    "출애굽기": "2",
    "레위기": "3",
    "민수기": "4",
    "신명기": "5",
    "여호수아": "6",
    "사사기": "7",
    "룻기": "8",
    "사무엘상": "9",
    "사무엘하": "10",
    "열왕기상": "11",
    "열왕기하": "12",
    "역대상": "13",
    "역대하": "14",
    "에스라": "15",
    "느헤미야": "16",
    "에스더": "17",
    "욥기": "18",
    "시편": "19",
    "잠언": "20",
    "전도서": "21",
    "아가": "22",
    "이사야": "23",
    "예레미야": "24",
    "예레미야 애가": "25",
    "에스겔": "26",
    "다니엘": "27",
    "호세아": "28",
    "요엘": "29",
    "아모스": "30",
    "오바댜": "31",
    "요나": "32",
    "미가": "33",
    "나훔": "34",
    "하박국": "35",
    "스바냐": "36",
    "학개": "37",
    "스가랴": "38",
    "말라기": "39",
    "마태복음": "40",
    "마가복음": "41",
    "누가복음": "42",
    "요한복음": "43",
    "사도행전": "44",
    "로마서": "45",
    "고린도전서": "46",
    "고린도후서": "47",
    "갈라디아서": "48",
    "에베소서": "49",
    "빌립보서": "50",
    "골로새서": "51",
    "데살로니가전서": "52",
    "데살로니가후서": "53",
    "디모데전서": "54",
    "디모데후서": "55",
    "디도서": "56",
    "빌레몬서": "57",
    "히브리서": "58",
    "야고보서": "59",
    "베드로전서": "60",
    "베드로후서": "61",
    "요한1서": "62",
    "요한2서": "63",
    "요한3서": "64",
    "유다서": "65",
    "요한계시록": "66"
}


function alertNoBookError(book){
    const e = new Error("책 " + book + " (을)를 찾지 못했습니다.");
    Error.captureStackTrace(e)
    e.name = "NoBookError"
    e.stack = e.stack.split("\n").slice(1).join("\n");
    throw e
}

Bible.formatVerseURL = function(book, chapter){
    if(book in this.BookCode){
        chapter >>= 0
        return format(this.VERSE_API_FORMAT, {
            book: this.BookCode[book],
            chapter: chapter
        })
    }
    else
        alertNoBookError(book)
}

Bible.requestVerse = function(book, chapter){
    try {
        return org.jsoup.Jsoup.connect(this.formatVerseURL(book, chapter))
            .timeout(1000).get()
    } catch(e){
        return null // connection failed
    }
}

Bible.getVerse = function(book, chapter){
    const req = this.requestVerse(book, chapter)
    if(req === null)
        return []
    return req.select('#one_jang > b').text().split(/\d+\./).slice(1).map(v => v.trim().replace('○', ''))
}



Bible.HYMN_API_FORMAT = "http://www.holybible.or.kr/NHYMN/cgi/hymnftxt.php?VR=NHYMN&DN={code}"

Bible.formatHymnURL = function(hymnCode){
    return format(this.HYMN_API_FORMAT, {
        code: hymnCode
    })
}

Bible.requestHymn = function(hymnCode){
    try{
        return org.jsoup.Jsoup.connect(this.formatHymnURL(hymnCode))
            .timeout(4000).get()
    }catch(e){
        return null
    }
}

Bible.getHymn = function(hymnCode){
    const req = this.requestHymn(hymnCode)
    if(req === null)
        return []
    let res
    return {
        title: req.select('body > table:nth-child(4) > tbody > tr:nth-child(5) > td.tk > b')
            .text().match(/\d+\. ([ 0-9가-힣]+)/)[1],
        content: req.select('body > table:nth-child(5) > tbody > tr')
            .toArray().map(tr => {
                res = {
                    part: tr.select('td:nth-child(2)').text(),
                    lyrics: tr.select('td:nth-child(3)').text()
                }
                if(res.part !== "[후렴]")
                    res.part = res.part.slice(0,-1)
                return res
            })
        }
}

/**
 * @param {object} hymnData result of getHymn()
 * @param {number?} hymnCode code of the hymn; if null, fill as a blank of the code in title string
 */
Bible.stringifyHymn = function(hymnData, hymnCode){
    return '  ' + (hymnCode? hymnCode + '. ': '') + hymnData.title + '\n\n'
        + hymnData.content.map(v => (v.part === "[후렴]"? v.part: v.part + '.') + ' ' + v.lyrics).join('\n')
}



return Bible
})()