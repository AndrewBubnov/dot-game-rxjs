import {
    SET_STARTED,
    SET_VALUES,
    SET_SLIDER_VALUES,
    SET_RANDOM_INDEX,
    SET_GAME_FIELD,
    SET_SCORE,
    SET_WINNER,
    SET_NEXT_GAME,
    SET_LEADER_BOARD,
    SET_MODAL_OPEN, SET_ERROR_MESSAGE, SET_PRESETS,
} from './types'


import { store$ } from '../reducers/index'
import axios from "axios";
import { dateTime } from "../utils/utils";



export const presetUrl = 'https://dot-game-api.herokuapp.com/api/presets'
export const winnerUrl = 'https://dot-game-api.herokuapp.com/api/winner'
const presetError = `Can not get presets from server. The mock data will be used.`
const leaderBoardError = `Can not get leader board from server. Please try to refresh the page.`
const serverSaveError = `Sorry, something's gone wrong on server. Please try again!`
const dispatch = store$.dispatch

const getState = () => {
    let state = null
    store$.subscribe(store => state = store)
    return state
}
//**********************

export const setStart = () => {
    dispatch ({type: SET_STARTED, payload: true})
    setResetGame()
    setGameProcess()
}
//**********************

const setGameProcess = () => {
    const {score, randomIndex, values: {preset: {field, delay: del}}} = getState()
    const {computer, user} = score
    const size = field * field
    if (computer <= size / 2 && user <= size / 2) {
        setTimeout(() => {
            const gameField = getState().gameField
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
            dispatch({type: SET_RANDOM_INDEX, payload: index})
            dispatch({type: SET_GAME_FIELD, payload: array})
            setGameProcess()
        }, del)
    }
}
//**********************

const addScore = (score, player, size) => {
    const newScore = score[player] + 1
    store$.dispatch ({type: SET_SCORE, payload: {...score, [player]: newScore}})
    if (newScore > size/2) {
        setWinner()
    }
}
//**********************

const setWinner = async () => {
    const { score, values: { name } } = getState()
    const user = name ? name : 'User'
    const winner = score.user > score.computer ? user : 'Computer'
    dispatch ({type: SET_WINNER, payload: winner})
    dispatch ({type: SET_NEXT_GAME, payload: true})
    try {
        const response = await axios.post(winnerUrl, {winner, date: dateTime()})
        if (response.data.length > 10) response.data.splice(0, response.data.length - 10)
        dispatch ({type: SET_LEADER_BOARD, payload: response.data})
    } catch (err) {
        dispatch ({type: SET_MODAL_OPEN, payload: true})
        dispatch ({type: SET_ERROR_MESSAGE, payload: serverSaveError})
    } finally {
        dispatch ({type: SET_STARTED, payload: false})
    }
}
//**********************

export const getPresetsFromServer = async () => {
    try {
        const response = await axios.get(presetUrl)
        dispatch ({type: SET_PRESETS, payload: response.data})
    } catch (err) {
        const presets = {
            easyMode: {field: 5, delay: 2000},
            hardMode: {field: 15, delay: 900},
            normalMode: {field: 10, delay: 1000},
        }
        dispatch ({type: SET_MODAL_OPEN, payload: true})
        dispatch ({type: SET_ERROR_MESSAGE, payload: presetError})
        dispatch ({type: SET_PRESETS, payload: presets})
    }
}
//**********************

export const getLeaderBoard = async () => {
    try {
        const response = await axios.get(winnerUrl)
        if (response.data.length > 10) response.data.splice(0, response.data.length - 10)
        dispatch ({type: SET_LEADER_BOARD, payload: response.data})
    } catch (err) {
        dispatch ({type: SET_MODAL_OPEN, payload: true})
        dispatch ({type: SET_ERROR_MESSAGE, payload: leaderBoardError})
    }
}
//**********************

export const onUserClick = (e) => {
    const id = Number(e.target.id.substring(1))
    const { score, gameField, randomIndex, winner, values: {preset: {field}} } = getState()
    const size = field*field
    if (id === randomIndex && gameField[randomIndex] !== 'user' && !winner){
        let array = [...gameField]
        array[randomIndex] = 'user'
        dispatch ({type: SET_GAME_FIELD, payload: array})
        addScore(score, 'user', size)
    }
}
//**********************

export const setModalClosed = () => {
    dispatch ({type: SET_MODAL_OPEN, payload: false})
    dispatch ({type: SET_ERROR_MESSAGE, payload: ''})
}
//**********************

export const setResetGame = () => {
    const { field } = getState().values.preset
    const gameField = (Array.from({length: field*field}, v => ''))
    dispatch ({type: SET_GAME_FIELD, payload: gameField})
    dispatch ({type: SET_SCORE, payload: {computer: 0, user: 0}})
    dispatch ({type: SET_WINNER, payload: ''})

}
//**********************

export const handleChange = (e, name) => store$.dispatch({type: SET_VALUES, payload: {name, value: e.target.value}})
//**********************

export const handleSliderChange = (name, value) => store$.dispatch({type: SET_SLIDER_VALUES, payload: {name, value}})
//**********************