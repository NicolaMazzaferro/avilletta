/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Leggi lo stato da localStorage al caricamento dell'applicazione
        const storedLoggedIn = localStorage.getItem('isLoggedIn');
        return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
    });

    const login = () => {
        // Logica per il login
        setIsLoggedIn(true);
        // Salva lo stato in localStorage
        localStorage.setItem('isLoggedIn', true);
    };

    const logout = () => {
        // Logica per il logout
        setIsLoggedIn(false);
        // Rimuovi lo stato da localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
