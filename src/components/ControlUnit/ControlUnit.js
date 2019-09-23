import React, {useState, useEffect} from 'react'
import {initialState, store$} from '../../reducers/index'
import {setStart, getPresetsFromServer, handleChange} from '../../actions/actionCreators'
import * as PropTypes from 'prop-types';
import {controlStyles as useStyles} from '../../styles/styles'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './ControlUnit.css'


const ControlUnit = () => {
    const [state, setState] = useState(initialState)
    const { values, presets, started, nextGame } = state
    useEffect(() => {
        store$.subscribe(v => setState(v))
    }, [])
    const classes = useStyles();


    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);


    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);


    useEffect(() => {
        getPresetsFromServer()
    }, [getPresetsFromServer])

    const presetsList = Object.entries(presets).map(item =>
        <MenuItem key={item[0]} value={item[1]}>{item[0].split('M')[0] + ' mode'}</MenuItem>)

    return (
        <div className='control-unit-container'>
            <Button variant="outlined" className={classes.button} onClick={setStart} disabled={started}>
                {nextGame ? 'Play again' : (started ? 'Playing' : 'Play')}
            </Button>
            <TextField
                label="Name"
                className={classes.textField}
                value={values.name}
                onChange={(e) => handleChange(e, 'name')}
                margin="normal"
                variant="outlined"
                autoComplete="off"
            />
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="presets">
                    Game mode
                </InputLabel>
                <Select
                    value={values.preset}
                    onChange={(e) => handleChange(e, 'preset')}
                    input={<OutlinedInput labelWidth={labelWidth} name="preset"/>}
                >
                    {presetsList}
                </Select>
            </FormControl>
        </div>
    )
}


ControlUnit.propTypes = {
    setStartGame: PropTypes.func,
    getPresetsFromServer: PropTypes.func,
    handleChange: PropTypes.func,
    started: PropTypes.bool,
    nextGame: PropTypes.bool,
    presets: PropTypes.shape({
        easyMode: PropTypes.shape({
            field: PropTypes.number,
            delay: PropTypes.number,
        }),
        normalMode: PropTypes.shape({
            field: PropTypes.number,
            delay: PropTypes.number,
        }),
        hardMode: PropTypes.shape({
            field: PropTypes.number,
            delay: PropTypes.number,
        }),
    }),
    values: PropTypes.shape({
        preset: PropTypes.shape({
            field: PropTypes.number,
            delay: PropTypes.number,
        }),
        name: PropTypes.string,
    }),
}

export default ControlUnit
