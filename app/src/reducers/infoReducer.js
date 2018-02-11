import React from 'react';

export default function reducer(state = {
    animeName: '',
    posterImg: '',
    slug: '',
    animeID: 0
}, action) {
    switch(action.type) {
        case 'LAUNCH_INFO': {
            return Object.assign({}, state, {
                animeName: action.payload.animeName,
                posterImg: action.payload.posterImg,
                slug: action.payload.slug,
                animeID: action.payload.animeID
            })
        }
        default: return state
    }
}