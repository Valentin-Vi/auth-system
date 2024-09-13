import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../util/fetch';
import Loading from '../components/informative/Loading';

const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [ user, setUser ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        initializeUser()
        .then(user => {
            setUser(user);
            setIsLoading(false);
        });
    }, []);

    async function initializeUser() {
        const res = await api('/auth/refresh', {
            method: 'POST',
        });
        setIsLoading(false);
        return res.ok ? await res.json() : null;
    };

    const signup = async (email, password, firstname, lastname) => {
        const res = await api(
            '/auth/signup',
            {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstname: firstname,
                    lastname: lastname,
                })
            }
        )
        .catch(err => { throw new Error('Error signing up utilizing register function in AuthProvider.jsx' + err); });
        return res.status;
    };

    const login = async (email, password) => {

        console.log(user);

        const res = await api(
            '/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }
        );

        if(res.status === 200) {
            const decoded = await res.json();
            setUser(decoded);
        };
        return res.status;
    };

    const logout = async () => {
        await api(
            '/auth/logout', {
                method: 'POST',
            }
        );
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, isLoading, initializeUser }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth mus be used within an AuthProvider.');
    }
    return context;
};