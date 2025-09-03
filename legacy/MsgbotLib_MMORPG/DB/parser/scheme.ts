/**
@description
최초 로드를 위한 틀이자 일종의 백업으로, 실제 데이터 저장 구조와는 다를 수 있다.
*/

type space_id = { // draft/room/space_id.json
    name: string
    dimension: 0 | 1 | 2 | 3 // 각 Room에 부여되는 위치벡터의 차원. 0이면 없다.
    rooms: {
        roomId: {
            name: string,
            type: 0 | 1 // 0=Room, 1=Node
            cord: { x: number, y: number, z: number } // 좌표. 속한 공간의 차원에 따라 각 반영 여부가 결정된다.
            direct: [string] // 가리키는 roomId 배열. type=1(Node)일 경우에만 반영.
            intro: '방 정보'
        }
    }
}

type entity = {  // draft/entityType(code).json = [{entity}]
    name: 
}