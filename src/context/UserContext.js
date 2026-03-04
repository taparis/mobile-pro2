import React, { createContext, useReducer, useState, useEffect, useDeferredValue } from "react";

import { db, auth } from "../service/firebaseconfig";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext()

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddsyp3qjv/image/upload';
const UPLOAD_PRESET = 'ooktofja';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(null)

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                const userDocRef = doc(db, "users", authUser.uid);

                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUser({ uid: authUser.uid, ...docSnap.data() });
                    } else {
                        setUser({ uid: authUser.uid });
                    }
                    setLoading(false);
                });
                return () => unsubscribeSnapshot();
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
                    "Accept": "appliccation/json",
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
        if (!auth.currentUser) return false

        try {
            let finalImageUrl = userData.image

            if (newImageUri) {
                console.log("กำลัง upload . . .")
                const uploadedUrl = await uploadToCloudinary(newImageUri)
                if (uploadedUrl) finalImageUrl = uploadedUrl
            }

            const userDocRef = doc(db, "users", auth.currentUser.uid);

            const dataToSave = {
                name: userData.name || "",
                faculty: userData.faculty || "",
                major: userData.major || "",
                year: userData.year || "",
                image: finalImageUrl || null,
                updatedAt: new Date().toDateString()
            }
            await setDoc(userDocRef, dataToSave, { merge: true })
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