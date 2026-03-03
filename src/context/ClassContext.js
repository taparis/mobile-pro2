import React, { createContext, useReducer, useState, useEffect } from "react";

import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "../service/firebaseconfig";

export const ClassContext = createContext();

export const ClassProvider = ({ children }) => {
  const [classes, setClasses] = useState([])
  const [exams, setExams] = useState([])

  //เพิ่ม ลบ แก้
  const addClass = async (payload) => {
    try {
      await addDoc(collection(db, "classes"), payload)
    } catch (error) {
      console.error("เกิดข้อผิดพลาดไม่สามารถเพิ่มวิชาได้", error)
    }
  }

  const updateClass = async (id, payload) => {
    try {
      const docRef = doc(db, "classes", id)
      const {id : _, ...dataToUpdate} = payload
      await updateDoc(docRef, dataToUpdate)
    }catch (error) {
      console.error ("เกิดข้อผิดพลาดไม่สามารถ update ได้", error)
    }
  }

  const deleteClass = async (id) => {
    try {
      await deleteDoc(doc(db, "classes", id))
    }catch (error){
      console.error ("เกิดข้อผิดพลาดไม่สามารถลบได้", error)
    }
  }

  const addExam = async (payload) => {
    try {
      await addDoc(collection(db, "exams"), payload)
    }catch (error) {
      console.error ("เกิดข้อผิดพลาดไม่สามารถเพิ่มการสอบได้", error)
    }
  }

  const updateExam = async (id, payload) => {
    try {
      const docRef = doc(db, "exams", id)
      const {id : _, ...dataToUpdate} = payload
      await updateDoc(docRef, dataToUpdate)
    }catch (error) {
      console.error ("เกิดข้อผิดพลาดไม่สามารถ update ได้", error)
    }
  }

  const deleteExam = async (id) => {
    try {
      await deleteDoc(doc(db, "exams", id))
    }catch (error){
      console.error ("เกิดข้อผิดพลาดไม่สามารถลบได้", error)
    }
  }
  //ดึงข้อมูลจาก  จาก firebase
  useEffect(() => {
    const qClasses = query(collection(db, "classes"))
    const unsubClasses = onSnapshot(qClasses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setClasses(data)
    })

    const qExams = query(collection(db, "exam"))
    const unsubExams = onSnapshot(qExams, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setExams(data)
    })
    return () => {
      unsubClasses()
      unsubExams()
    }
  }, [])

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