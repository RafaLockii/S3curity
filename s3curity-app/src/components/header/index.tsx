import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useImageContext } from '@/context/imagesContext';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import api from '@/lib/axios';
import { useModuloContext } from '@/context/moduloContext';

interface userProps{
    id: number;
    token: string;
    email: string;
    nome: string;
    acesso_admin: boolean;
}
interface ModuloProps{
    id: number;
    nome: string;
}

export function Header() {
    const { image, setImage } = useImageContext();
    const[logo, setLogo] = useState<string>("");
    // const[modulo, setModulo] = useState<string | number>();
    const[moduloDefault, setModuloDefault] = useState()
    const[modulos, setModulos] = useState<ModuloProps[]>([]);
    const[moduloSelected, setModuloSelected] = useState<string | number>();
    const {modulo, setModulo} = useModuloContext();


    // const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    //     const newValue = e.target.value as string | number;
    //     setModuloSelected(newValue); // Update selected value in state
    //     sessionStorage.setItem('selectedModulo', JSON.stringify(newValue)); // Save selected value to sessionStorage
    // };
    

    // useEffect(() => {
    //     const storedLogo= localStorage.getItem('logo'); // Fetch 'logo' from localStorage
    //     if (storedLogo) {
    //         setLogo(storedLogo);
    //     }
        
    // }, []);

    useEffect(() => {
    const fetchData = async () => {
        try{
            const response = await api.get(`user/${(JSON.parse(window.localStorage.getItem('user') || '') as userProps).id}`);
            const modulos = response.data.modulos;
            setModuloDefault(response.data.modulo_default ? response.data.modulo_default : 1);
            setModulos(modulos);
        } catch (e) {
        alert(`Erro inesperado: ${e}`);
        }
    }
    fetchData();
    }, []);
    console.log("LOGO NO HEADER: "+logo);
    return(
        <header>
            <div className={styles.Content}>
                <section className={styles.sectionContent}>
                    <img 
                        src={logo}
                        alt='Logo'
                        // quality={100}
                        width={200}
                        height={50}
                    />
                    <hr className={styles.divisor}/>
                        <Select
                            value={modulo?.id ? modulo?.id : moduloDefault} 
                            label="Modulo"
                            onChange={(e)=>{
                                const newValue = e.target.value;
                                setModuloSelected(newValue);
                                setModulo({
                                    id: Number(newValue),
                                    nome: "",
                                })
                            }}
                        >
                            {modulos && (
                                modulos.map((moduloData) => {
                                    return <MenuItem value={moduloData.id}>
                                        <h1 className={styles.operacional}>{moduloData.nome}</h1>
                                    </MenuItem>
                                })
                            )}
                            {/* <MenuItem value={1}>
                                <h1 className={styles.operacional}>OPERACIONAL</h1>
                            </MenuItem>
                            <MenuItem value={2}><h1 className={styles.operacional}>ESTRATÉGICO</h1></MenuItem>
                            <MenuItem value={3}><h1 className={styles.operacional}>GERENCIAL</h1></MenuItem> */}
                        </Select>
                    {/* <h1 className={styles.operacional}>OPERACIONAL</h1> */}
                </section>
            </div>
        </header>
        )
}