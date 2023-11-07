import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

type User = {
  id: number;
  token: string;
  email: string;
  nome: string;
  acesso_admin: boolean;
};

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>({
    id: 0,
    token: '',
    email: '',
    nome: '',
    acesso_admin: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
