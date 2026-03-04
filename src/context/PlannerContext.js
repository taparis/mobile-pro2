import React, { createContext, useState, useEffect } from "react";

import { db, auth } from "../service/firebaseconfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from "firebase/firestore";
import { add } from "firebase/firestore/pipelines";
import { onAuthStateChanged } from "firebase/auth";

export const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null)
        })
        return unsubAuth
    }, [])

    //ดึงข้อมูลจาก firebase
    useEffect(() => {
        const q = query(collection(db, "planner_tasks"))

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const item = doc.data()
                return {
                    id: doc.id,
                    ...item,
                    date : item.date?.toDate ? item.date.toDate() : item.date
                }
            })
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
            const { id, ...dataToUpdate } = updated
            await updateDoc(taskRef, dataToUpdate)
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