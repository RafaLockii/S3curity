// import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState, useEffect } from 'react';

// type User = {
//   id: number;
//   token: string;
//   email: string;
//   nome: string;
//   acesso_admin: boolean;
// };

// type UserContextType = {
//   user: User | null;
//   setUser: Dispatch<SetStateAction<User | null>>;
// };

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error('useUserContext must be used within a UserProvider');
//   }
//   return context;
// };

// type UserProviderProps = {
//   children: ReactNode;
// };

// export const UserProvider = ({ children }: UserProviderProps) => {
//   // Check if window is defined (i.e., we are on the client side)
//   const isClientSide = typeof window !== 'undefined';

//   // Use the initial state when creating the state
//   const [user, setUser] = useState<User | null>(() => {
//     if (isClientSide) {
//       // Check if user data is available in localStorage
//       const storedUserData = window.localStorage.getItem('user');
//       return storedUserData ? JSON.parse(storedUserData) : null;
//     } else {
//       return null;
//     }
//   });

//   useEffect(() => {
//     // Update user value in local storage when it changes
//     if (isClientSide) {
//       window.localStorage.setItem('user', JSON.stringify(user));
//     }
//   }, [user, isClientSide]);

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // export const UserProvider = ({ children }: UserProviderProps) => {
// //   // Check if window is defined (i.e., we are on the client side)
// //   const isClientSide = typeof window !== 'undefined';

// //   // Use the initial state when creating the state
// //   const [user, setUser] = useState<User | null>(() => {
// //     if (isClientSide) {
// //       // Check if user data is available in localStorage
// //       const storedUserData = window.localStorage.getItem('user');
// //       return storedUserData ? JSON.parse(storedUserData) : null;
// //     } else {
// //       return null;
// //     }
// //   });

// //   return (
// //     <UserContext.Provider value={{ user, setUser }}>
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// // export const UserProvider = ({ children }: UserProviderProps) => {
// //   // const storedUserData = window.localStorage.getItem('user');
// //   // const initialUserState: User | null = storedUserData ? JSON.parse(storedUserData) : null;

// //   // const [user, setUser] = useState<User | null>(initialUserState);

// //   const [user, setUser] = useState<User | null>({
// //     id: 0,
// //     token: '',
// //     email: '',
// //     nome: '',
// //     acesso_admin: false,
// //   });

// //   return (
// //     <UserContext.Provider value={{ user, setUser }}>
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };
