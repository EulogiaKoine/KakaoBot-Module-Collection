module.exports = {

    isAble: function(Player){
        return [false,[
            "오늘은 이미 다른 이를 전담하고 있습니다."
        ].join("\n")];
    },

    func: function(Player){
        return true;
    }
    
};