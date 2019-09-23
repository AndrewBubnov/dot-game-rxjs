import React, { useState, useEffect } from 'react'
import { onUserClick, setResetGame } from '../../actions/actionCreators'
import Cover from "../Cover/Cover";
import * as PropTypes from 'prop-types';
import Cell from "../Cell/Cell";
import './Field.css'
import {initialState, store$} from "../../reducers";





const Field = () => {
    const [state, setState] = useState(initialState)
    const {values: {preset: {field}}, gameField} = state
    useEffect(() => {
        store$.subscribe(v => setState(v))
    }, [])



    useEffect(() => {
        setResetGame()
    }, [field])

    const output = gameField.map((item, index) =>
        <Cell
            key={index}
            width={700 / field - 4}
            height={700 / field - 4}
            number={index}
            value={gameField[index]}
        />)

    return (
        <div className='field' onClick={onUserClick}>
            {output}
        </div>
    )
}



Field.propTypes = {
    onUserClick: PropTypes.func,
    setResetGame: PropTypes.func,
    gameField: PropTypes.arrayOf(PropTypes.string),
    started: PropTypes.bool,
}

export default Field
