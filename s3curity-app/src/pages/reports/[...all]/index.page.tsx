'use-client'
import SidebarMenu from "@/components/SideBarMenu"
import styles from './styles.module.css';
import { Header } from "@/components/header";
import useRouter from "next/router";
import { useEffect, useState } from "react";

export default function Reports(){
    // const empresa = typeof query.empresa ==='string' ? query.empresa : '';
    const [queryData, setQueryData] = useState({
        empresa: '',
        link: ''
    })

    const[loading, setLoading] = useState(true)

    useEffect(() =>{
        const {query} = useRouter;
        let data: string[] = [];

    if (typeof query.all === 'string') {
        // Se query.all for uma string, converta-a em um array
        data.push(query.all);
    } else if (Array.isArray(query.all)) {
        // Se query.all for um array, use-o diretamente
        data = query.all;
    }
        // A variável data contém pelo menos um valor
        const link = data[0];
        const empresa = data[1] || '';
        setQueryData({
            empresa: empresa,
            link: link
        })
        setLoading(false);
    }, [])

    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={queryData.empresa}/>
            {!loading ? (
                <>
                <div className={styles.header}>
                    <Header/>
                </div>
                <div className={styles.createUserFormContainer}>
                <iframe title="Report Section" width="100%" height="90%" src={queryData.link} frameBorder={0} allowFullScreen={true}></iframe>
                </div>
                </>
            ) : (
                <p>Carregando...</p>
            )}
        </div>
    )
}