import React, { createContext, useState } from "react";

export const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {

    const [tasks, setTasks] = useState([]);

    const addTask = (task) => setTasks(prev => [...prev, task]);

    const updateTask = updated =>
        setTasks(prev =>
            prev.map(t => t.id === updated.id ? updated : t)
        );

    const removeTask = id =>
        setTasks(prev =>
            prev.filter(t => t.id !== id)
        );

    const resetTasks = () => setTasks([]);

    return (
        <PlannerContext.Provider
            value={{ tasks, addTask, removeTask, updateTask, resetTasks }}
        >
            {children}
        </PlannerContext.Provider>
    );
};