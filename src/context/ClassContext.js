import React, { createContext, useReducer } from "react";

export const ClassContext = createContext();

const initialState = {
  classes: [],
  exams: [],
};

const formReducer = (state, action) => {
  switch (action.type) {

    case "ADD_CLASS":
      return {
        ...state,
        classes: [
          ...state.classes,
          { id: Date.now(), ...action.payload }
        ]
      };

    case "UPDATE_CLASS":
      return {
        ...state,
        classes: state.classes.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "ADD_EXAM":
      return {
        ...state,
        exams: [
          ...state.exams,
          { id: Date.now(), ...action.payload }
        ]
      };

    case "UPDATE_EXAM":
      return {
        ...state,
        exams: state.exams.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const ClassProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <ClassContext.Provider
      value={{
        classes: state.classes,
        exams: state.exams,
        dispatch
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};