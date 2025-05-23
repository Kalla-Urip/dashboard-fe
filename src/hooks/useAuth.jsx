/* eslint-disable react-refresh/only-export-components */
import { useNavigate } from "react-router";
import { useLocalStorage } from "./useLocalStorage";
import { createContext, useContext, useMemo } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useLocalStorage('kalla_dashboard_user', null);

    const navigate = useNavigate()

    const login = (data) => {
        setUser(data)
        navigate('/')
    }

    const logout = () => {
        setUser(null);
        navigate("/", { replace: true });
    };

    const value = useMemo(
        () => ({
          user,
          login,
          logout,
        }),
        [user]
      );

    return <AuthContext.Provider value={value} >{children}</AuthContext.Provider>

}

export const useAuth = () => {
    return useContext(AuthContext)
}