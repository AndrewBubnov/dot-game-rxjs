import { BehaviorSubject } from 'rxjs'
import {scan, shareReplay} from 'rxjs/operators'

import {
    SET_STARTED,
    SET_PRESETS,
    SET_NEXT_GAME,
    SET_LEADER_BOARD,
    SET_VALUES,
    SET_MODAL_OPEN,
    SET_ERROR_MESSAGE,
    SET_SCORE,
    SET_GAME_FIELD,
    SET_WINNER,
    SET_RANDOM_INDEX,
    SET_SLIDER_VALUES,
    ADD_WINNER
} from '../actions/types'

export const initialState = {
    started: false,
    presets: {},
    nextGame: false,
    leaderBoard: [],
    values: {
        preset: {
            field: 5,
            delay: 2000,
        },
        name: ''
    },
    score: {
        computer: 0,
        user: 0
    },
    modalOpen: false,
    errorMessage: '',
    gameField: [],
    winner: '',
    randomIndex: null,
}

function rootReducer (state = initialState, {type, payload}) {
    switch (type){
        case SET_STARTED:
            return {...state, started: payload}
        case SET_PRESETS:
            return {...state, presets: payload}
        case SET_NEXT_GAME:
            return {...state, nextGame: payload}
        case SET_LEADER_BOARD:
            return {...state, leaderBoard: payload}
        case SET_MODAL_OPEN:
            return {...state, modalOpen: payload}
        case SET_ERROR_MESSAGE:
            return {...state, errorMessage: payload}
        case SET_SCORE:
            return {...state, score: payload}
        case SET_GAME_FIELD:
            return {...state, gameField: payload}
        case SET_WINNER:
            return {...state, winner: payload}
        case SET_RANDOM_INDEX:
            return {...state, randomIndex: payload}
        case SET_VALUES:
            return {...state, values: {...state.values, [payload.name]: payload.value}}
        case ADD_WINNER:
            return {...state, leaderBoard: [...state.leaderBoard, payload]}
        case SET_SLIDER_VALUES:
            return {...state, values: {...state.values, preset: {...state.values.preset, [payload.name]: payload.value}}}

        default:
            return {...state}
    }
}



function createStore(reducer) {
    const subj$ = new BehaviorSubject(initialState)
    const store$ = subj$.pipe(
        scan(reducer, undefined),
        shareReplay(1)
    )
    store$.dispatch = action => subj$.next(action)
    return store$
}

export const store$ = createStore(rootReducer)
