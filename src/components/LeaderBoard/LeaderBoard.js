import React, {useContext, useEffect} from 'react'
import { StateContext } from "../../context/StateProvider";
import {getLeaderBoard} from '../../actions/actionCreators'
import * as PropTypes from 'prop-types';
import Modal from "../Modal/Modal";
import './LeaderBoard.css'

const LeaderBoard = () => {
    const { leaderBoard, modalOpen, errorMessage } = useContext(StateContext)
    useEffect(() => {
        getLeaderBoard()
    }, [])

    const leaderList = leaderBoard.map(item => <div key={item.id} className='leader-board-item'>
        <div className='record'>Winner: {item.winner}</div>
        <div className='record'>Date: {item.date}</div>
    </div>)
    return (
        <>
            <div className='leader-board'>
                {leaderList}
            </div>
            <Modal
                errorMessage={errorMessage}
                modalOpen={modalOpen}
            />
        </>
    )
}

LeaderBoard.propTypes = {
    getLeaderBoard: PropTypes.func,
    leaderBoard: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        winner: PropTypes.string,
        date: PropTypes.string,
    })),
}

export default LeaderBoard