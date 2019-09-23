import React, {createContext, useEffect, useState} from "react";
import {initialState, store$} from "../reducers";

export const StateContext = createContext(initialState)

const StateProvider = ({ children }) => {

    const [state, setState] = useState(initialState)

    useEffect(() => {
        store$.subscribe(v => setState(v))
    }, [])
    return <StateContext.Provider value={state} >{children}</StateContext.Provider>
}

export default StateProvider