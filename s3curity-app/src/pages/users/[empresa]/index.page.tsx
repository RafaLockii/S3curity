import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import CreateUserForm from "../components/createUserForm";
import styles from './styles.module.css';
import UpdateForm from "../components/updateForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import TableComponent from "../components/table";
import  useRouter from "next/router";
import { api } from "@/lib/axios";

export default function Users(){
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [userData, setUserData] = useState([]);

    const handleShowCreateUserForm = (show: boolean) => {
        setShowCreateUserForm(show);}
    const handleShowUpdateForm = (show: boolean) => {
        setShowUpdateForm(show);}

    // const userData = [
    //     {
    //         nome: 'João',
    //         empresa: 'Empresa 1',
    //         operacional: true,
    //         estrategico: false,
    //         gerencial: true,
    //         ativo: true,
    //     },
    //     {
    //         nome: 'Maria',
    //         empresa: 'Empresa 2',
    //         operacional: true,
    //         estrategico: false,
    //         gerencial: true,
    //         ativo: true,
    //     },
    // ]
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/users/getUser');
                setUserData(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    
        fetchData();
    }, []);

    console.log(userData);

    //Resgatando data da URL
    const {query} = useRouter;
    const empresa = typeof query.empresa == 'string' ? query.empresa : "";


    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresa}/>
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

                    {/* Aqui eu estou passando a epresa da url para o forms */}
                    <CreateUserForm empresa={empresa}/>
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