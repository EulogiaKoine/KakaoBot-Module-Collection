const serif = (() => {
const alphabet = {
    bold: ["𝐀","𝐁","𝐂","𝐃","𝐄","𝐅","𝐆","𝐇","𝐈","𝐉","𝐊","𝐋","𝐌","𝐍","𝐎","𝐏","𝐐","𝐑","𝐒","𝐓","𝐔","𝐕","𝐖","𝐗","𝐘","𝐙","𝐚","𝐛","𝐜","𝐝","𝐞","𝐟","𝐠","𝐡","𝐢","𝐣","𝐤","𝐥","𝐦","𝐧","𝐨","𝐩","𝐪","𝐫","𝐬","𝐭","𝐮","𝐯","𝐰","𝐱","𝐲","𝐳"]
}

const number = {
    bold: ["𝟎","𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖","𝟗"]
}


return function serif(str, serifNum){
    let res = '', v, c
    const FA = alphabet.bold, L = str.length

    if(serifNum){
        const FN = number.bold
        for(let i = 0; i < L; i++){
            if((v = (c = str[i]).charCodeAt()) > 64 && v < 91)
                res += FA[v-65]
            else if(v > 96 && v < 123)
                res += FA[v-71]
            else if(v > 47 && v < 58)
                res += FN[v-48]
            else
                res += c
        }
    } else {
        for(let i = 0; i < L; i++){
            if((v = (c = str[i]).charCodeAt()) > 64 && v < 91)
                res += FA[v-65]
            else if(v > 96 && v < 123)
                res += FA[v-71]
            else
                res += c
        }
    }

    return res
}
})()





