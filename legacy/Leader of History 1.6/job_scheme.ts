interface ActiveAbility {
    action: string
    use(user, target)
}
interface Actable {
    getActiveAbility(ability: ActiveAbility)
    loseActiveAbility()
    act(action: string, ...args: any[])
}

// 전략 패턴으로 기존의 객체 정보를 편집하던 '반응' 메서드의 작동 방식을 변경
interface PassiveAbility{
    event: string,
    react(user, target)
}
interface Reactable {
    getPassiveAbility(ability: PassiveAbility)
    losePassiveAbility(ability: PassiveAbility)
}

interface Avatar extends Actable, Reactable { }


type Job = {
    name: string
    active: ActiveAbility[]
    passive: PassiveAbility[]
}

interface Worker extends Avatar {
    job: string
    getJob(job: Job)
    getAbilities()
}



interface StateManager {
    $defaultAction: { key: Function /** @param {Avatar} actor @param {Avatar} reactor */}
    $state: Map<Avatar, Function> /** @param {Avatar} actor @param {Avatar} reactor */

    process(key, actor: Avatar, reactor: Avatar)
}



interface LOH extends Game {
    /** @override */
    public constructor(){

    }
}