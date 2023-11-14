import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import CreateForm from "../components/createForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import TableComponent from "../components/table";
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
                {!showCreateForm && !showUpdateForm && (
                    <>
                    <div className={styles.formHeader}>
                        Empresas
                        <div className={styles.headerButtonContainer}>
                            <button className={styles.headerButton}>
                            Copiar
                            </button>
                            <button className={styles.headerButton} onClick={ () => handleShowCreateForm(true)}>
                            Criar
                            </button>
                        </div>
                    </div>
                    <TableComponent data={empresaData} empresa={empresa as string}/>
                    </>
                ) }
                {showCreateForm && (
                    <>
                        <div className={styles.formHeader}>
                            <p>Cadastro/Edição</p>
                            <ArrowLeft className={styles.arrowLeft} onClick={()  => handleShowCreateForm(false)}/>
                        </div>
                        <CreateForm/>
                    </>
                )}
            </div>
            <div className={styles.header}>
                <Header/>
            </div>
        </div>
    )
}