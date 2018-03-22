import { fixURL } from '../../util/util'
const h2p = require('html2plaintext')
const dym = require('didyoumean2')

export function processExceptions(data, animeName, masteranisearch = false) {

    if(!masteranisearch) {
        var possible = data.result.find(el => fixURL(h2p(el.title)) == fixURL(animeName))
        if(possible) return possible

        var correctTitle = dym(animeName, data.result.map(el => el.title))
        return data.result.find(el => el.title == correctTitle)
    }

    if(masteranisearch) {
        var possible = data.find(el => fixURL(h2p(el.title)) == fixURL(animeName))
        if(possible) return possible

        var correctTitle = dym(animeName, data.map(el => el.title))
        return data.find(el => el.title == correctTitle)
    }

}