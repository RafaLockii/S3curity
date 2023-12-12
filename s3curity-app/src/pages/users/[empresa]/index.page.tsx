'use client'

import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import CreateUserForm from "../../../components/createUserForm";
import styles from './styles.module.css';
import UpdateForm from "../../../components/updateForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import TableComponent from "../../../components/MuiTableUser";
// import TableComponent from "../../../components/tableUser";
import  useRouter from "next/router";
import { api } from "@/lib/axios";
import { EmpresaData } from "@/types/types";


export default function Users(){
    
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [userData, setUserData] = useState([]);
    const [empresas, setEmpresas] = useState<EmpresaData[]>([]);
    const [empresaid, setEmpresaId] = useState<number>();
    const [storedUser, setStoredUser] = useState<any>();
    const [loading, setLoading] = useState(true);

    const handleShowCreateUserForm = (show: boolean) => {
        setShowCreateUserForm(show);}

    //Resgatando data da URL
    // const {query} = useRouter;
    // const empresaParams = typeof query.empresa == 'string' ? query.empresa : "";

    const[empresaParams, setEmpresaParams] = useState<string>();
   

    useEffect(() => {
        const fetchData = async () => {
            try {

                if (typeof window !== 'undefined') {
                    setStoredUser(sessionStorage.getItem('selectedUser'));
                    setEmpresaParams(JSON.parse(window.localStorage.getItem('empresa') || '{}').empresa || '');

                }
                const response2 = await api.get('empresas');
                setEmpresas(response2.data);
                // Encontrar a empresa correspondente e definir o ID
                const foundEmpresa = response2.data.find((empresa: { nome: string; }) => empresa.nome === empresaParams);
                if (foundEmpresa) {
                    setEmpresaId(foundEmpresa.id);
                }

                const response = await api.get(`users/all/${empresaParams}`);
                setUserData(response.data);
    
    
                
            } catch (error) {
                console.error(error);
            }
            setLoading(false)
        };
    
        fetchData();
    }, [empresaParams]);
    

    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresaParams as string}/>
            {!loading && (
            <>
            <div className={styles.createUserFormContainer}>
                {!showCreateUserForm && !showUpdateForm && (
                <>
                <div className={styles.formHeader}>
                    <p style={{marginLeft: '5rem'}}>Usuários</p>
                    <div className={styles.headerButtonContainer}>
                        <button className={styles.headerButton} onClick={ () => handleShowCreateUserForm(true)}>
                        Copiar
                        </button>
                        <button className={styles.headerButton} onClick={ () => {sessionStorage.removeItem('selectedUser');handleShowCreateUserForm(true)}}>
                        Criar
                        </button>
                    </div>
                </div>

                <TableComponent data={userData} empresa={empresaParams as string}/>
                </>

                )}
                {showCreateUserForm && (
                <>
                    <div className={styles.formHeader}>
                        <p style={{marginLeft: '1.5rem'}}>Cadastro</p>
                        <ArrowLeft className={styles.arrowLeft} onClick={ () => {window.sessionStorage.removeItem('selectedUser');handleShowCreateUserForm(false)}} />
                    </div>

                    {/* Aqui eu estou passando a epresa da url para o forms */}
                    {empresaid && <CreateUserForm empresa={empresaParams as string} empresaid={empresaid} empresas={empresas}/>}
                    {empresaid == undefined && (
                        <div>Carregando...</div>
                    )}
                </>)
                }
                {/* <UpdateForm/> */}
            </div>
            <div className={styles.header}>
                <Header/>
            </div> 
            </>
            )}           
        </div>
    )
}