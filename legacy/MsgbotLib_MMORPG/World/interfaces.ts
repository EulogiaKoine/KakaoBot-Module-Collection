interface ScriptManager{
    getText(code: string): string
}

type Core = './base/Core.Core'
interface Content{
    enter(core: Core)
    exit(core: Core)
}