module.exports = (function(){

function Job(){
    this.$jobs = {} /** @type {{ jobName: string[] }} 능력들 */
    this.$p = {} /** @type {{ playerId: jobName }} */
}

Job.prototype.initJob = function(job, skills){
    if(typeof job === "string" && Array.isArray(skills)){
        this.$job[job] = skills.slice()
        return
    }
    const e = new TypeError("job: string, skills: string[]")
    Error.captureStackTrace(e)
    throw e
}

Job.prototype.setJob = function(id, job){
    if(job in this.$jobs){
        this.$p[id] = job
        return
    }
    const e = new TypeError("job " + job + " doesn't initialized")
    Error.captureStackTrace(e)
    throw e
}

Job.prototype.getJob = function(id){
    return this.$p[id] || null
}

Job.prototype.getSkillsOfJob = function(job){
    if(job in this.$jobs)
        return this.$jobs[job].slice()
    const e = new TypeError("job " + job + " doesn't intialized")
    Error.captureStackTrace(e)
    throw e
}

Job.prototype.getSkills = function(id){
    return id in this.$p? this.$jobs[this.$p[id]].slice(): []
}


return { Job: Job }
})()