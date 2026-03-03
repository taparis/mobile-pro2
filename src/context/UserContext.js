import React, { createContext, useReducer, useState, useEffect, useDeferredValue } from "react";

import { db } from "../service/firebaseconfig";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export const UserContext = createContext()

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddsyp3qjv/image/upload';
const UPLOAD_PRESET = 'ooktofja';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name : "",
        faculty : "",
        major : "",
        year : "",
        image : null
    })

    const userDocRef = doc(db, "users", "current_user")

    useEffect(() => {
        const unsub = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()){
                setUser(docSnap.data())
            }
        })
        return () => unsub()
    })

    const uploadToCloudinary = async (uri) => {
        const data = new FormData()
        data.append('file', {
            uri : uri,
            type : 'image/jpeg',
            name : 'profile_image.jpg'
        })
        data.append('update_preset', UPLOAD_PRESET)

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method : 'POST',
                body : data
            })
            const result = await response.json()
            return result.secure_url
        } catch (err) {
            console.error("อัพโหลดรูปไม่สำเร็จ", err)
            return null
        }
    }

    const saveUserProfile = async (userData, newImageUri = null) => {
        try {
            let finalImageUrl = userData.image

            if(newImageUri){
                console.log("กำลัง upload . . .")
                const uploadedUrl = await uploadToCloudinary(newImageUri)
                if (uploadedUrl) finalImageUrl = uploadedUrl
            }

            const dataToSave = {...userData, image : finalImageUrl}

            await setDoc(userDocRef, dataToSave, {merge : true})
            return true
        }catch (error){
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