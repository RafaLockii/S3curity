'use client'

import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import UpdateForm from "../../../components/updateForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import  useRouter from "next/router";
import { api } from "@/lib/axios";
import { UserData } from "@/types/types";



export default function EditUsers(){
    
    const [userData, setUserData] = useState<UserData>();
    const[data, setData] = useState<string[]>()
    const { back} = useRouter;
       
    

    useEffect(() => {
        const fetchData = async () => {
            const {query, back} = useRouter;

            let data: string[] = [];

            if (typeof query.all === 'string') {
                // Se query.all for uma string, converta-a em um array
                data.push(query.all);
            } else if (Array.isArray(query.all)) {
                // Se query.all for um array, use-o diretamente
                data = query.all;
            }
            
            if (data.length > 0) {
                // A variável data contém pelo menos um valor
                const id = data[0];
                const empresa = data[1] || '';
                setData(data);
            } else {
                // A variável data está vazia
            }
            try {
                const response = await api.get(`user/${data[0]}`);
                setUserData(response.data);
            } catch (error) {
                console.error(error);
            }
            
        }
    
        fetchData();
    }, []);

    return(
        <div className={styles.pageContainer}>
            {data && (
                <>
                    <SidebarMenu empresa={data[1]}/>
                {userData ? ( // Verifique se userData está definido
                    <div className={styles.createUserFormContainer}>
                        <div className={styles.formHeader}>
                            <p style={{marginLeft: '1.5rem'}}>Edição</p>
                            <ArrowLeft className={styles.arrowLeft} onClick={() => back()} />
                        </div>

                        {/* Renderize o UpdateForm somente se userData estiver definido */}
                        {userData && (
                            <UpdateForm />
                        )}
                    </div>
                ) : (
                    <div>Carregando...</div>
                )}
                <div className={styles.header}>
                    <Header/>
                </div>
                </>
            )}            
        </div>
    )
}