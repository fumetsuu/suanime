export function processExceptions(data, animeName) {
    var exceptionIdx = masteranimallinkexceptions.findIndex(el => el.animeName == animeName)
    if(exceptionIdx != -1) {
        return masteranimallinkexceptions[exceptionIdx].data
    }
    return data.result.find(el => el.title == this.props.animeName) || data.result[1]  //this relies on the name being consistent between MAL and Masterani databases, if they aren't consistent, takes the SECOND result to try and compensate
}

const masteranimallinkexceptions = [
    {
        animeName: "Bokura wa Minna Kawai-sou",
        data: {
            "id":21405,
            "url":"https:\/\/myanimelist.net\/anime\/21405\/Bokura_wa_Minna_Kawai-sou",
            "title":"Bokura wa Minna Kawai-sou"
        }
    }
]