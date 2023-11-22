import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import CreateForm from "../../../components/CreateFormItens";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import useRouter from "next/router";
import { api } from "@/lib/axios";

export default function Enterprise(){

    const[showCreateForm, setShowCreateForm] = useState(false);
    const[showUpdateForm, setShowUpdateForm] = useState(false);
    const[empresaData, setEmpresaData] = useState([]);
    // const {query} = useRouter;
    // const empresa = typeof query.empresa == 'string' ? query.empresa : "";
    const[empresa, setEmpresa] = useState<string>();

    const handleShowCreateForm = (show: boolean) => {
        setShowCreateForm(show);}
    const handleShowUpdateForm = (show: boolean) => {
        setShowUpdateForm(show);}

    const data =[{
        nome: 'Empresa',
        operacional: true,
        estrategico: false,
        gerencial: true,
        ativo: true,
    }]

   useEffect(() =>{
    const fetchData = async () =>{
        try{
            setEmpresa(JSON.parse(window.localStorage.getItem('empresa') || '{}').empresa || '');
            const response = await api.get('empresas')
            setEmpresaData(response.data);
        } catch(e){
            console.error(e)
        }
    }

    fetchData();
   }, [])

    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresa as string}/>
            <div className={styles.createFormContainer}>
                <div className={styles.formHeader}>
                    <p>Cadastro de itens</p>
                </div>
                <CreateForm/>
            </div>
            <div className={styles.header}>
                <Header/>
            </div>
        </div>
    )
}