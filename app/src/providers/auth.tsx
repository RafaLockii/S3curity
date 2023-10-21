import { useEffect, useState } from "react";
import AuthContext from "../contexts/auth";
import api from '../services/api';


type AuthProviderProps = {
    children: React.ReactNode; // 👈️ type children
};

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUser] = useState<object | null>(null);

    useEffect(() => {
        const storagedUser = localStorage.getItem('@App:user');
        const storagedToken = localStorage.getItem('@App:token');

        if (storagedToken && storagedUser) {
            //setUser(JSON.parse(storagedUser));
            api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        }
    }, []);

    function Logout() {
        setUser(null);

        sessionStorage.removeItem('@App:user');
        sessionStorage.removeItem('App:token');
    }

    async function Login(email: string, senha: string) {

        console.log(email, senha)
        const response = await api.post('/login', {
            email,
            senha,
        });

        console.log(response.data)

        setUser(response.data.user);
        api.defaults.headers.Authorization = `Bearer ${response.data.token}`

        localStorage.setItem('@App:user', JSON.stringify(response.data.user));
        localStorage.setItem('@App:token', response.data.token);

        return;
    }


    return (
        <AuthContext.Provider value={{ signed: Boolean(user), user, Login, Logout }}>
            {children}
        </AuthContext.Provider>
    );
};