export function maxDownloads() {
    var temparr = []
    for(var i = 1; i < 16; i++) {
        temparr.push({
            value: i,
            label: i.toString()
        })
    }
    return temparr
}