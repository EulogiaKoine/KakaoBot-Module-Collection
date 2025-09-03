interface PlayingView {
    alert(data: PlayingData)
}


// 시나리오 감상자 관련 기본 데이터
// 출력 방식은 외부에서 알아서.
interface PlayingData { // 사실상 DTO
    text: string // 현재 텍스트
    $views: Iterable<PlayingView>

    bind(view: PlayingView)
    unbind(view: PlayingView)
    getViews(): Iterable<PlayingView>
    alert() // $views.forEach(v => v.alert(this))
}



interface Survivor {
    readonly status: object // 내용 자유 편집 가능
}


// 스테이터스, 아이템 추가
interface Traveler {
    $items: { // private
        itemName: number // 이름: 수량
    }

    itemCount(name: string): number // 해당 아이템의 수량
    addItem(name: string, amount: number) // 아이템 추가
    removeItem(name: string, amount: number) // 아이템 삭제; 보유 수량보다 많이 깎을 시 오류
    list(): { name: number } // $items 복사본
    // 아이템에 대한 세부정보(ex. 태그 등)는 외부 DB에 저장.
}

interface SceneCounter {
    played_scene_count: number
}


interface GameData extends PlayingData, Survivor, Traveler, SceneCounter {
    // 그냥 대충 분리함
    // 그림에는 PlayingData로 되어있음. 
}


// 아이템 관련 세부 정보 접근용 인터페이스(언젠간 쓰겠지)
interface ItemDAO {
    getTags(name: string): [string] // 해당 아이템의 태그들 반환
    getStats(name: string): object // 해당 아이템의 능력치를 객체로 반환
}





type index = number | string
type block = {
    fn: string // execution id
    arg: string // argument
}

// 이야기가 진행될 방식과 그 내용을 그 순서대로 담은 대본
interface Scenario {
    readonly code: string
    readonly condition: Function // condition(player: PlayingData): boolean
    readonly table: { id: object }
    seq: [block]

    constructor(code: string, condition: Function)
    size(): number
    idlist(): [index]
    getIdxById(id: string): index
    getById(id: string): block
    getByIdx(idx: index): block
    add(block: block, id: string|void)
}


// 시나리오 진행역
interface StoryTeller {
    playing: Scenario
    $focus: number | -1

    isPlaying(): boolean
    getCurrentScene(): Scenario // 현재 플레이 중인 시나리오

    get focus(): number // 현재 포커스
    set focus(idx: number)// 인덱스 기반 포커스 이동; 정수 제한 + 시나리오 크기 제한

    focusOnById(id: string) // 플레이 중인 시나리오 내 ID로 포커스 이동
    getFocusingId(): string
    getFocusing(): object // 시나리오 내 포커싱 중인 블럭

    startScene(scene: Scenario) // playing 전환. isPlaying() == false일 때만 가능
    endScene() // playing = null
}


// 시나리오 대기열
interface SceneWaiting {
    // 편집 미허용
    readonly next: [Scenario] // 바로 다음 시나리오(필수) 예약 큐
    readonly pendings: [Scenario] // 랜덤 대기열
    readonly waitings: [{left: number, scene: Scenario}] // N회만큼 대기가 필요한 것들; 끝나면 pendings로 올라감

    ables(): [Scenario] // pendings.filter(v => v.condition() == true)
    getNextScene(): Scenario // next 최상단이거나, 없으면 pending에서 랜덤으로 가져와서 삭제.
    // if getNextScene() == null then, 예외처리 필요. 엔딩으로 등록된 시나리오를 추가해서 재시도하던가.
    addNextScene(scene: Scenario) // next에 push

    addScene(scene: Scenario, waitCount: number|void) // 대기열에 시나리오 추가. waitCount != void일 경우 waitings로, 아니면 pendings
    updateWaitCount(delta: number) // waitings의 left 값 일괄 변경. 0 이하인 것들은 pendings로 올려보냄.
}


//  < 고민의 흔적 >
// 단순한 테이블 매핑으로 가변성을 챙기는 것 말고, 다른 방법은 없을까?
// '블럭'을 처리하느냐, '함수'를 처리햐느냐의 문제의 해결도 필요.
// 차라리 컴파일 직접 함수를 run하는 대신 exec() 인터페이스를 가진 객체를 반환하는 것도? 약간의 전략.
// 위의 게 고민되는 이유는 어차피 인자를 가변적으로 넣기는 힘들기 때문에. switch문을 쓰는 것도 고려해볼만 하긴 하다.
// 한 줄 커맨드도 결국 컴파일러가 블럭 객체로 전달할 테니...
// 서버(공용) 데이터는 해당 참조를 가진 함수를 추가하는 방식으로 하자. 그럼 되겠지.

//  < 결론 >
// 블럭 단위로 처리
// args는 블럭 내부의 문자열 자체.
// 사실 Executor은 블럭에 대한 의존성은 가지지 않는다. 등록된 함수가 처리할 문제.
// (*중요) Executor은 클래스로서, 플레이 시작 시각 플레이어마다 다른 의존성을 가진 함수를 등록하여 이용한다.
abstract class Executor {
    private table: { fn_id: Function }

    abstract set(id: string, fn: Function)
    abstract get(id: string): Function|null
    run(id: string, input: string): void {
        // return값이 void인 이유는, 선택적인 문자열의 출력까지가 함수의 역할이기 때문에.
    }
}


// 시나리오의 생기있는 '재생'을 맡는다.
abstract class Player {
    readonly data: PlayingData
    readonly teller: StoryTeller
    readonly waiting: SceneWaiting // 사전에 미리 next로 처음 시작 시나리오와 대기열을 만들어놓기
    readonly executor: Executor

    abstract Player(data: PlayingData, teller: StoryTeller, wait: SceneWaiting, exe: Executor)
    abstract moveScene(): boolean // (현재 시나리오가 있으면 종료하고)다음 시나리오로 이동. 다음 시나리오가 없으면 false
    abstract play() // 포커스가 잡힌 블럭을 executor에 넣어 실행하고 다음 포커스로 이동(조건부)
    abstract isPlaying(): boolean // teller.isPlaying()
}


abstract class AutoPlayer extends Player {
    autoPlaying: boolean
    $id: number|undefined // timeout id
    delay: number
    private static PLAY_KEY: Symbol

    automataize(on: boolean){
        if(on){
            this.autoPlaying = true
            this.play()
        } else {
            this.autoPlaying = false
            clearTimeout(this.$id)
            delete this.$id
        }
    }
    setDelay(delay: number){
        this.delay = delay
    }
    override play(key: Symbol){
        // super.play()
        if(this.autoPlaying)
            this.$id = setTimeout(() => {
                this.delay = 0
                this.play()
            }, this.delay)
    }
}


// Executor에 추가할 함수(=블럭 종류)들
function print(text: string){
    // text로 ViewModel(PlayingData)을 갱신 -> 바인딩된 View로 전달
    // ViewModel에 의존
}

function delay(sec: string){
    // AutoPlayer(임시명; 자동 재생기) 의존
    // AutoPlayingData의 다음 재생까지의 딜레이 속성을 갱신한다.
}

function goto(idx: string){
    // StoryTeller을 의존
}

function finish(){
    // StoryTeller 의존
    // endScene() 호출
}




// 지나치게 복잡한 설계는 불필요하니 블럭 내의 블럭은 일단 허용하지 않음.
// (컴파일러)