import store from '../store.js'

export function sidenavtoggle() {
    store.dispatch({
        type: 'TOGGLE_SIDENAV'
    })
}