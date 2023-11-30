import { createContext, useContext, ReactNode, Dispatch, SetStateAction, useState } from 'react';

type Modulo = {
id: number;
nome: string;
};

type ModuloContextType = {
modulo: Modulo | null;
setModulo: Dispatch<SetStateAction<Modulo | null>>;
};

const ModuloContext = createContext<ModuloContextType | undefined>(undefined);

export const useModuloContext = () => {
const context = useContext(ModuloContext);
if (context === undefined) {
throw new Error('useModuloContext must be used within a ModuloProvider');
}
return context;
};

type ModuloProviderProps = {
children: ReactNode;
};

export const ModuloProvider = ({ children }: ModuloProviderProps) => {
const [modulo, setModulo] = useState<Modulo | null>({
id: 0,
nome: 'Default'
});

return (
<ModuloContext.Provider value={{ modulo, setModulo }}>
    {children}
</ModuloContext.Provider>
);
};
