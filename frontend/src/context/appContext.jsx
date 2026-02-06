import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../services/axios";

export const appContent = createContext()

export const AppContextProvider = (props) => {

    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [memberLoggedIn, setMemberLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const adminRes = await axios.get("/api/auth/isAdminAuth");
                if (adminRes.data.success) setAdminLoggedIn(true);
            } catch { }

            try {
                const memberRes = await axios.get("/api/member/isAuth");
                if (memberRes.data.success) setMemberLoggedIn(true);
            } catch { }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const value = {
        adminLoggedIn,
        setAdminLoggedIn,
        memberLoggedIn,
        setMemberLoggedIn,
        loading, setLoading
    }

    return (
        <appContent.Provider value={value}>
            {props.children}
        </appContent.Provider>
    )
}