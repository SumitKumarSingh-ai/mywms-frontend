import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getAuth, getRedirectResult, getIdToken } from "firebase/auth";
import app from '../firebaseConfig';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

    useEffect(() => {
        const processToken = (currentToken) => {
            if (currentToken) {
                localStorage.setItem('token', currentToken);
                const decoded = jwtDecode(currentToken);
                setUser({ username: decoded.sub, role: decoded.role, warehouse_id: decoded.warehouse_id });
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        };

        processToken(token);
        
        const auth = getAuth(app);
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    const idToken = await getIdToken(result.user);
                    const backendResult = await googleLogin(idToken);
                    if(backendResult.success) {
                         processToken(backendResult.token);
                    }
                }
            }).catch((error) => {
                console.error("Error processing Google redirect result:", error);
            }).finally(() => {
                setLoading(false);
            });

    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login/', { username, password });
            setToken(response.data.access_token);
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.detail || "Login failed. The server might be offline.";
            return { success: false, message: message };
        }
    };

    const googleLogin = async (idToken) => {
        try {
            const response = await api.post('/auth/google-login/', { token: idToken });
            return { success: true, token: response.data.access_token };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || "Google login failed" };
        }
    };

    const logout = () => {
        setToken(null);
    };

    const value = { token, user, login, logout };

    if (loading && !token) {
         return <div className="bg-slate-100 min-h-screen flex items-center justify-center text-slate-800 text-xl">Loading...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};