import React, { createContext, useState, useEffect } from "react";

import { db, auth } from "../service/firebaseconfig";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

export const PlannerContext = createContext();

export const PlannerProvider = ({ children }) => {

  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState(null);

  // เช็ค user login
  useEffect(() => {

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });

    return unsubAuth;

  }, []);


  // โหลด task realtime
  useEffect(() => {

    if (!userId) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, "planner_tasks"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snapshot) => {

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      setTasks(data);

    });

    return () => unsub();

  }, [userId]);


  // เพิ่ม task
  const addTask = async (task) => {

    if (!userId) return;

    try {

      await addDoc(collection(db, "planner_tasks"), {
        ...task,
        userId: userId
      });

    } catch (error) {

      console.error("เพิ่มกิจกรรมไม่ได้", error);

    }

  };


  // แก้ไข task
  const updateTask = async (updated) => {

    try {

      const taskRef = doc(db, "planner_tasks", updated.id);

      const { id, ...data } = updated;

      await updateDoc(taskRef, data);

    } catch (error) {

      console.error("เกิดข้อผิดพลาดในการ update", error);

    }

  };


  // ลบ task
  const removeTask = async (id) => {

    try {

      await deleteDoc(doc(db, "planner_tasks", id));

    } catch (error) {

      console.error("เกิดข้อผิดพลาดในการลบกิจกรรม", error);

    }

  };

  const toggleTask = async (task) => {

    try {

      const ref = doc(db, "planner_tasks", task.id);

      await updateDoc(ref, {
        completed: !task.completed
      });

    } catch (error) {

      console.error("เปลี่ยนสถานะ task ไม่ได้", error);

    }

  };


  return (
    <PlannerContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        removeTask,
        toggleTask
      }}
    >
      {children}
    </PlannerContext.Provider>
  );

};