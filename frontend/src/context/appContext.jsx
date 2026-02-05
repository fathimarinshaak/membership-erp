import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../services/axios";

export const appContent = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_API_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const getAuthState = async () => {
        try {
            const { data } = await axios.get('/api/auth/isAuth')
            if (data.success) {
                setIsLoggedIn(true)
            }
        } catch (error) {
                toast.error(error.message)
            }
        }

    useEffect(()=>{
        getAuthState()
    },[])
    
    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn
    }

    return (
        <appContent.Provider value={value}>
            {props.children}
        </appContent.Provider>
    )
}