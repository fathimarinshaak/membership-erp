import { createContext, useEffect, useState } from "react";
import axios from "../services/axios";

export const appContent = createContext()

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_API_URL

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get("/api/auth/isAdminAuth");
                if (data.success) {
                    setIsLoggedIn(true);
                }
            } catch {
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        loading,setLoading
    }

    return (
        <appContent.Provider value={value}>
            {props.children}
        </appContent.Provider>
    )
}