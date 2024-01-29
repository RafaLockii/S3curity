import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useImageContext } from '@/context/imagesContext';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import api from '@/lib/axios';
import { useModuloContext } from '@/context/moduloContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

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
    // const[modulo, setModulo] = useState<string | number>();
    const[moduloDefault, setModuloDefault] = useState()
    const[modulos, setModulos] = useState<ModuloProps[]>([]);
    const[moduloSelected, setModuloSelected] = useState<string | number>();
    const {modulo, setModulo} = useModuloContext();
    const[loading, setLoading] = useState(true);
    const[logo, setLogo] = useState('');
    const[empresaParams, setEmpresaParams] = useState('');
    const router = useRouter();
    

    useEffect(() => {
    const fetchData = async () => {
        try{
            const response = await api.get(`user/${(JSON.parse(window.localStorage.getItem('user') || '') as userProps).id}`);
            const modulos = response.data.modulos;
            setModuloDefault(response.data.modulo_default ? response.data.modulo_default : 1);
            setModulos(modulos);
            const logo =  window.localStorage.getItem('logo') || '';
            const trimmedLogo = logo.replace(/^"|"$/g, '');
            setLogo(trimmedLogo);
            const empresaQuery = JSON.parse(sessionStorage.getItem('empresa') || '{}');
            const empresaName = empresaQuery.empresa;
            setEmpresaParams(empresaName);
        } catch (e) {
            const logo = window.localStorage.getItem('logo') || '';
            const trimmedLogo = logo.replace(/^"|"$/g, '');
            setLogo(trimmedLogo)
            alert(`Erro inesperado: ${e}`);
        }
        setLoading(false);
    }
    fetchData();
    }, []);


    return(
        <div>
        {!loading && (
        <header>
            <div className={styles.Content}>
                <section className={styles.sectionContent}>
                    <img 
                        src={logo}
                        alt='Logo'
                        // quality={100}
                        width={200}
                        height={58}
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
                                });
                                router.push(`/home/${empresaParams}`);
                            }}
                        >
                            {modulos && (
                                modulos.map((moduloData) => (
                                    <MenuItem key={moduloData.id} value={moduloData.id}>
                                        <h1 className={styles.operacional}>{moduloData.nome}</h1>
                                    </MenuItem>
                                    ))
                            )}
                            {/* {modulos && (
                                modulos.map((moduloData) => {
                                    return <MenuItem key={moduloData.id} value={moduloData.id}>
                                        <h1 className={styles.operacional}>{moduloData.nome}</h1>
                                    </MenuItem>
                                })
                            )} */}
                        </Select>
                    {/* <h1 className={styles.operacional}>OPERACIONAL</h1> */}
                </section>
            </div>
        </header>
        )}
        </div>
        )
}