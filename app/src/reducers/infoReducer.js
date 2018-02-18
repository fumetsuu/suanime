import React from 'react';

export default function reducer(state = {
    animeName: '',
    slug: '',
    animeID: 0,
    malID: 0
}, action) {
    switch(action.type) {
        case 'LAUNCH_INFO': {
            return Object.assign({}, state, {
                animeName: action.payload.animeName,
                slug: action.payload.slug,
                animeID: action.payload.animeID,
                malID: action.payload.malID
            })
        }
        default: return state
    }
}