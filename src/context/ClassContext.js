import React, { createContext, useReducer } from "react";

export const ClassContext = createContext();

const formReducer = (state, action) => {
  switch (action.type) {
    case "ADD_CLASS":
      return [...state, {id: Date.now(), ...action.payload}];

    case "UPDATE_CLASS":
      return state.map(item =>
        item.id === action.payload.id ? action.payload : item
      );

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const ClassProvider = ({ children }) => {
  const [classes, dispatch] = useReducer(formReducer, []);

  return (
    <ClassContext.Provider value={{ classes, dispatch }}>
      {children}
    </ClassContext.Provider>
  );
};
