import React, { createContext, useReducer } from "react";

export const UserContext = createContext()

const userReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return action.payload;
        case "UPDATE_USER":
            return { ...state, ...action.payload };
        default:
            return state
    }
}

export const UserProvider = ({ children }) => {
    const [user, dispatch] = useReducer(userReducer, [])

    return (
        <UserContext.Provider value={{ user, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}