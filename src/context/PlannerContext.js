import React, { createContext, useState, useEffect } from "react";

import { db } from "../service/firebaseconfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from "firebase/firestore";
import { add } from "firebase/firestore/pipelines";

export const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    //ดึงข้อมูลจาก firebase

    useEffect(() => {
        const q = query(collection(db, "planner_tasks"))

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data
            }))
            setTasks(data)
        })
        return () => unsub()
    }, [])

    //เพิ่ม ลบ แก้
    const addTask = async (task) => {
        try {
            await addDoc(collection(db, "planner_tasks"), task)
        } catch (error) {
            console.error("เกิดข้อผิดพลาดไม่สามาถเพิ่มกิจกรรมได้", error)
        }
    }

    const updateTask = async (updated) => {
        try {
            const taskRef = doc(db, "planner_tasks", updated.id)
            const { id, ...dateToUpdate } = updated
            await updateDoc(taskRef, dateToUpdate)
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการ update", error)
        }
    }

    const removeTask = async (id) => {
        try {
            await deleteDoc(doc(db, "planner_tasks", id))
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการลบกิจกรรม", error)
        }
    }


    return (
        <PlannerContext.Provider
            value={{
                tasks,
                addTask,
                removeTask,
                updateTask,
            }}
        >
            {children}
        </PlannerContext.Provider>
    );
};