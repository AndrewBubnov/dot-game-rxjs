import React, { useEffect, useContext } from 'react'
import { StateContext } from "../../context/StateProvider";
import { onUserClick, setResetGame } from '../../actions/actions'
import * as PropTypes from 'prop-types';
import Cell from "../Cell/Cell";
import './Field.css'

const side = window.innerWidth <= 380 ? window.innerWidth *.95 : 700

const Field = () => {
    const state = useContext(StateContext)
    const {values: {preset: {field}}, gameField} = state

    useEffect(() => {
        setResetGame()
    }, [field])


    const output = gameField.map((item, index) =>
        <Cell
            key={index}
            width={side / field - 4}
            height={side / field - 4}
            number={index}
            value={gameField[index]}
        />)

    return (
        <div className='field' onClick={onUserClick} style={{width: side, height: side}}>
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
