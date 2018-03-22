import { fixURL } from '../../util/util'
const decodeHTML = require('ent/decode')
const dym = require('didyoumean2')

export function processExceptions(data, animeName, masteranisearch = false) {

    if(!masteranisearch) {
        var possible = data.result.find(el => fixURL(decodeHTML(el.title)) == fixURL(animeName))
        if(possible) return possible

        var correctTitle = dym(animeName, data.result.map(el => el.title))
        return data.result.find(el => el.title == correctTitle)
    }

    if(masteranisearch) {
        var possible = data.find(el => fixURL(decodeHTML(el.title)) == fixURL(animeName))
        if(possible) return possible

        var correctTitle = dym(animeName, data.map(el => el.title))
        return data.find(el => el.title == correctTitle)
    }

}