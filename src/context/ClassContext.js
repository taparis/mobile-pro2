import React, { createContext, useReducer, useState, useEffect } from "react";

import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, where, getDocs } from "firebase/firestore";
import { db, auth } from "../service/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";

export const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([])
  const [exams, setExams] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null)
    })
    return unsubAuth
  }, [])
  //เพิ่ม ลบ แก้
  const addClass = async (payload) => {
    if (!userId) return
    try {
      await addDoc(collection(db, "classes"), { ...payload, userId })
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถเพิ่มวิชาได้", error)
    }
  }

  const updateClass = async (id, payload) => {
    try {
      const docRef = doc(db, "classes", id)
      const { id: _, ...dataToUpdate } = payload
      await updateDoc(docRef, dataToUpdate)
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถ update ได้", error)
    }
  }

  const deleteClass = async (id) => {
    try {
      // หา code ของวิชาที่จะลบ
      const targetClass = classes.find((c) => c.id === id);

      // ลบวิชา
      await deleteDoc(doc(db, "classes", id));

      // ถ้ายังมีวิชา code เดียวกันเหลืออยู่ ไม่ต้องลบ exam
      const sameCodeLeft = classes.filter(
        (c) => c.id !== id && c.code === targetClass?.code
      );

      if (targetClass && sameCodeLeft.length === 0) {
        // ลบ exam ที่ code ตรงกันทั้งหมด
        const examsToDelete = exams.filter((e) => e.code === targetClass.code);
        await Promise.all(
          examsToDelete.map((e) => deleteDoc(doc(db, "exams", e.id)))
        );
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถลบได้", error)
    }
  }

  const addExam = async (payload) => {
    try {
      await addDoc(collection(db, "exams"), { ...payload, userId })
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถเพิ่มการสอบได้", error)
    }
  }

  const updateExam = async (id, payload) => {
    try {
      const docRef = doc(db, "exams", id)
      const { id: _, ...dataToUpdate } = payload
      await updateDoc(docRef, dataToUpdate)
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถ update ได้", error)
    }
  }

  const deleteExam = async (id) => {
    try {
      await deleteDoc(doc(db, "exams", id))
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถลบได้", error)
    }
  }
  //ดึงข้อมูลจาก  จาก firebase
  useEffect(() => {
    if (!userId) {
      setClasses([]),
        setExams([])
      return
    }

    // 1. ดึงข้อมูล Classes
    const qClasses = query(collection(db, "classes"), where("userId", "==", userId));
    const unsubClasses = onSnapshot(qClasses, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          id: doc.id,
          ...item,
          starts: item.starts?.toDate ? item.starts.toDate() : item.starts,
          ends: item.ends?.toDate ? item.ends.toDate() : item.ends,
        };
      });
      setClasses(data);
    });

    const qExams = query(collection(db, "exams"), where("userId", "==", userId));
    const unsubExams = onSnapshot(qExams, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          id: doc.id,
          ...item,
          starts: item.starts?.toDate ? item.starts.toDate() : item.starts,
          ends: item.ends?.toDate ? item.ends.toDate() : item.ends,
          date: item.date?.toDate ? item.date.toDate() : item.date,
        };
      });
      setExams(data);
    });
    return () => {
      unsubClasses()
      unsubExams()
    }
  }, [userId])

  return (
    <ClassContext.Provider
      value={{
        classes,
        exams,
        addClass,
        updateClass,
        deleteClass,
        addExam,
        updateExam,
        deleteExam
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};