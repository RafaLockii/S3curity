import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import CreateForm from "./components/createForm";
import { useState } from "react";
import { ArrowLeft } from "phosphor-react";
import TableComponent from "./components/table";

export default function Enterprise(){

    const[showCreateForm, setShowCreateForm] = useState(false);
    const[showUpdateForm, setShowUpdateForm] = useState(false);

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


    return(
        <div className={styles.pageContainer}>
            <SidebarMenu/>
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
                    <TableComponent data={data}/>
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