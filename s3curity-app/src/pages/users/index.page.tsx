import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import CreateUserForm from "./components/createUserForm";
import styles from './styles.module.css';
import UpdateForm from "./components/updateForm";
import { useState } from "react";
import { ArrowLeft } from "phosphor-react";
import TableComponent from "./components/table";


export default function Users(){
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    const handleShowCreateUserForm = (show: boolean) => {
        setShowCreateUserForm(show);}
    const handleShowUpdateForm = (show: boolean) => {
        setShowUpdateForm(show);}
    
    const userData = [
        {
        nome: 'João',
        empresa: 'Empresa',
        operacional: true,
        estrategico: false,
        gerencial: true,
        ativo: true,
        },
    ]


    return(
        <div className={styles.pageContainer}>
            <SidebarMenu/>
            <div className={styles.createUserFormContainer}>
                {!showCreateUserForm && !showUpdateForm && (
                <>
                <div className={styles.formHeader}>
                    Usuários
                    <div className={styles.headerButtonContainer}>
                        <button className={styles.headerButton}>
                        Copiar
                        </button>
                        <button className={styles.headerButton} onClick={ () => handleShowCreateUserForm(true)}>
                        Criar
                        </button>
                    </div>
                </div>
                <TableComponent data={userData}/>
                </>

                )}
                {showCreateUserForm && (
                <>
                    <div className={styles.formHeader}>
                        <p>Cadastro/Edição</p>
                        <ArrowLeft className={styles.arrowLeft} onClick={ () =>handleShowCreateUserForm(false)} />
                    </div>
                    <CreateUserForm/>
                </>)
                }
                {/* <UpdateForm/> */}
            </div>
            <div className={styles.header}>
                <Header/>
            </div>            
        </div>
    )
}