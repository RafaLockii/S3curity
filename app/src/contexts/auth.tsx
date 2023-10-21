import { createContext, useContext } from "react";


interface AuthContextData {
    signed: boolean;
    Login(arg1: string, arg2: string): Promise<void>;
    Logout(): void;
    user: any
}


const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default AuthContext

export function useAuth() {
    const context = useContext(AuthContext);

    return context;
}
