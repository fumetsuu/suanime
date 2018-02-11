export function browserLink(url) {
    require('electron').shell.openExternal(url)        
}