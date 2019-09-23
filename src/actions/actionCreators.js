import {
    SET_VALUES,
    SET_SLIDER_VALUES,
    CALL_PRESETS,
    CALL_USER_CLICK,
    SET_RANDOM_INDEX,
    SET_GAME_FIELD,
    SET_SCORE,
    SET_WINNER,
    SET_NEXT_GAME,
    SET_LEADER_BOARD,
    SET_MODAL_OPEN, SET_ERROR_MESSAGE,
} from '../actions/actions'

import state, { store$ } from '../reducers/index'
import axios from "axios";
import { dateTime } from "../utils/utils";



export const presetUrl = 'http://starnavi-frontend-test-task.herokuapp.com/game-settings'
export const winnerUrl = 'http://starnavi-frontend-test-task.herokuapp.com/winners'
const presetError = `Can not get presets from server. The mock data will be used.`
const leaderBoardError = `Can not get leader board from server. Please try to refresh the page.`
const serverSaveError = `Sorry, something's gone wrong on server. Please try again!`

const getState = () => {
    let state = null
    store$.subscribe(store => state = store)
    return state
}


export const setStart = () => {
    setResetGame()
    setGameProcess()
}
//**********************

const setGameProcess = () => {
    const {score, gameField, randomIndex, values: {preset: {field, delay: del}}} = getState()
    const {computer, user} = score
    const size = field * field
    if (computer <= size / 2 && user <= size / 2) {
        setTimeout(() => {
            const array = [...gameField]
            if (gameField[randomIndex] === 'current') {
                array[randomIndex] = 'computer'
                addScore(score, 'computer', size)
            }
            let index = null
            while (score.computer <= size / 2 || score.user <= size / 2) {
                index = Math.floor(Math.random() * size)
                if (gameField[index] === '') break
            }
            array[index] = 'current'
            store$.dispatch({type: SET_RANDOM_INDEX, payload: index})
            store$.dispatch({type: SET_GAME_FIELD, payload: array})
            setGameProcess()
        }, del)
    }
}


const addScore = (score, player, size) => {
    const newScore = score[player] + 1
    store$.dispatch ({type: SET_SCORE, payload: {...score, [player]: newScore}})
    if (newScore > size/2) {
        setWinner()
    }
}

//**********************
const setWinner = () => {
    const { score, values: { name } } = getState()
    const user = name ? name : 'User'
    const winner = score.user > score.computer ? user : 'Computer'
    store$.dispatch ({type: SET_WINNER, payload: winner})
    store$.dispatch ({type: SET_NEXT_GAME, payload: true})
    try {
        const response = axios.post(winnerUrl, {winner, date: dateTime()})
        if (response.data.length > 10) response.data.splice(0, response.data.length - 10)
        store$.dispatch ({type: SET_LEADER_BOARD, payload: response.data})
    } catch (err) {
        store$.dispatch ({type: SET_MODAL_OPEN, payload: true})
        store$.dispatch ({type: SET_ERROR_MESSAGE, payload: serverSaveError})
    }
}
//**********************


export const getPresetsFromServer =  () => store$.dispatch({type: CALL_PRESETS})
//**********************

export const getLeaderBoard = async() => {
    try {
        const response = await axios.get(winnerUrl)
        if (response.data.length > 10) response.data.splice(0, response.data.length - 10)
        store$.dispatch ({type: SET_LEADER_BOARD, payload: response.data})
    } catch (err) {
        store$.dispatch ({type: SET_MODAL_OPEN, payload: true})
        store$.dispatch ({type: SET_ERROR_MESSAGE, payload: leaderBoardError})
    }
}
//**********************

export const onUserClick = (e) => store$.dispatch({type: CALL_USER_CLICK, payload: {e}})
//**********************

export const setModalClosed = () => {
    store$.dispatch ({type: SET_MODAL_OPEN, payload: false})
    store$.dispatch ({type: SET_ERROR_MESSAGE, payload: ''})
}
//**********************

export const setResetGame = () => {
    const { field } = state.values.preset
    const gameField = (Array.from({length: field*field}, v => ''))
    store$.dispatch ({type: SET_GAME_FIELD, payload: gameField})
    store$.dispatch ({type: SET_SCORE, payload: {computer: 0, user: 0}})
    store$.dispatch ({type: SET_WINNER, payload: ''})

}
//**********************

export const handleChange = (e, name) => store$.dispatch({type: SET_VALUES, payload: {name, value: e.target.value}})
//**********************

export const handleSliderChange = (name, value) => store$.dispatch({type: SET_SLIDER_VALUES, payload: {name, value}})