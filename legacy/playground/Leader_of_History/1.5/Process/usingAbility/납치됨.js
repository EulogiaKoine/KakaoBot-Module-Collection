module.exports = {

    isAble: function(Player){
        return [false,[
            "납치당한 상태라 능력 사용이 불가능합니다."
        ].join("\n")];
    },

    func: function(Player){
        return true;
    }

};