export default function reducer(state = {
    pclient: null
}, action) {
    switch(action.type) {
        case 'SET_CLIENT': {
            return Object.assign({}, state, {
                pclient: action.payload.pclient
            })
        }
        default: return state
    }
}