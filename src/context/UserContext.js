import React, { createContext, useReducer, useState, useEffect, useDeferredValue } from "react";

import { db, auth } from "../service/firebaseconfig";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext()

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddsyp3qjv/image/upload';
const UPLOAD_PRESET = 'ooktofja';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid)
                const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                    if(docSnap.exists()){
                        setUser({ uid : currentUser.uid, ...docSnap.data()})
                    }else {
                        setUser({ uid : currentUser.uid})
                    }
                    setLoading(false)
                })
                return () => unsubDoc()
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const uploadToCloudinary = async (uri) => {
        const data = new FormData()
        data.append('file', {
            uri: uri,
            type: 'image/jpeg',
            name: 'profile_image.jpg'
        })
        data.append('upload_preset', UPLOAD_PRESET)

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: data,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "multipart/form-data"
                }
            })
            const result = await response.json()
            return result.secure_url
        } catch (err) {
            console.error("อัพโหลดรูปไม่สำเร็จ", err)
            return null
        }
    }

    const saveUserProfile = async (userData, newImageUri = null) => {
        const currentUser = auth.currentUser
        if (!auth.currentUser) return false

        try {
            let finalImageUrl = userData.image

            if (newImageUri) {
                console.log("กำลัง upload . . .")
                const uploadedUrl = await uploadToCloudinary(newImageUri)
                if (uploadedUrl) finalImageUrl = uploadedUrl
            }

            const userDocRef = doc(db, "users", currentUser.uid);

            const dataToSave = {
                name: userData.name || "",
                faculty: userData.faculty || "",
                major: userData.major || "",
                year: userData.year || "",
                image: finalImageUrl || null,
                updatedAt: new Date().toISOString()
            }
            await setDoc(userDocRef, dataToSave, { merge: true })
            console.log("บันทึกข้อมูลสำเร็จสำหรับ UID : ", currentUser.uid)
            return true
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการบันทึก", error)
            return false
        }
    }

    return (
        <UserContext.Provider
            value={{
                user, saveUserProfile
            }}>
            {children}
        </UserContext.Provider>
    )
}