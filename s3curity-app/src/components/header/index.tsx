import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useImageContext } from '@/context/imagesContext';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';



export function Header() {
    const { image, setImage } = useImageContext();
    const[logo, setLogo] = useState<string>("");
    const[modulo, setModulo] = useState<string | number>();

    useEffect(() => {
        const storedLogo= localStorage.getItem('logo'); // Fetch 'logo' from localStorage
        if (storedLogo) {
            setLogo(storedLogo);
        }
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
                            value={modulo ? modulo : 1} 
                            label="Modulo"
                            onChange={(e) => {
                                setModulo(e.target.value);
                            }}
                        >
                            <MenuItem value={1}><h1 className={styles.operacional}>OPERACIONAL</h1></MenuItem>
                            <MenuItem value={2}><h1 className={styles.operacional}>ESTRATÉGICO</h1></MenuItem>
                            <MenuItem value={3}><h1 className={styles.operacional}>GERENCIAL</h1></MenuItem>
                        </Select>
                    {/* <h1 className={styles.operacional}>OPERACIONAL</h1> */}
                </section>
            </div>
        </header>
        )
}