import React, { createContext, useState, useEffect } from "react";

import { db, auth } from "../service/firebaseconfig";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
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

    useEffect(() => {
        if (!userId) {
            setTasks([])
            return
        }
        const q = query(collection(db, "planner_tasks"), where("userId", "==", userId))

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const item = doc.data();
                return {
                    id: doc.id,
                    ...item,
                    date: item.date?.toDate ? item.date.toDate() : item.date
                }
            })
            setTasks(data)
        })
        return () => unsub()
    }, [userId])

    const addTask = async (task) => {
        if (!userId) return
        try {
            await addDoc(collection(db, "planner_tasks"), { ...task, userId })
        } catch (error) {
            console.error("เกิดข้อผิดพลาดไม่สามาถเพิ่มกิจกรรมได้", error)
        }
    }

    const updateTask = async (id, updated) => {
        try {
            if (!id) return;

            setTasks(prevTasks => {
                return prevTasks.map(t => t.id === id ? { ...t, ...updated } : t);
            });

            const { id: _, ...dataToUpdate } = updated;
            const taskRef = doc(db, "planner_tasks", id);

            await updateDoc(taskRef, dataToUpdate);
            console.log("Firebase Updated!");
        } catch (error) {
            console.error("Update error:", error);
        }
    };

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