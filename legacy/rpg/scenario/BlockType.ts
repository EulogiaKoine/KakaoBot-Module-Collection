enum BlockType {
    text, // 문자열
    function, // 단일 함수
    codes, // 서브루틴
    choice, // 선택지
    random_choice // 랜덤 선택지
}

type text = {
    type: "text",
    content: string
}

type single_function = {
    type: "function",
    fn: Function
}

type codes = {
    type: "codes",
    codes: [Function]
}

type 