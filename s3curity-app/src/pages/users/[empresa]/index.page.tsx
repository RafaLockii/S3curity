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

//Interface de dados da empresa
interface EmpresaData {
    id: number;
    nome: string;
    cnpj: string;
    logo: string;
    data_alt: any;
    data_criacao: string;
    imagem_fundo: string;
    usuario_criacao: string;
    usuario_cad_alt: any;
  }
  

export default function Users(){
    
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [userData, setUserData] = useState([]);
    const [empresas, setEmpresas] = useState<EmpresaData[]>([]);
    const [empresaid, setEmpresaId] = useState<number>();

    const handleShowCreateUserForm = (show: boolean) => {
        setShowCreateUserForm(show);}
    const handleShowUpdateForm = (show: boolean) => {
        setShowUpdateForm(show);}

    //Resgatando data da URL
    const {query} = useRouter;
    const empresaParams = typeof query.empresa == 'string' ? query.empresa : "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/users/all');
                setUserData(response.data);

                const response2 = await api.get('/empresas');
                setEmpresas(response2.data);

                empresas.map((empresa) =>{
                    if(empresa.nome === empresaParams){
                        console.log("Id da empresa"+empresa.id)
                        setEmpresaId(empresa.id);
                    }
                })

            } catch (error) {
                console.error(error);
            }
        }
    
        fetchData();
    }, []);
    

    console.log("Id da empresa"+empresaid)
    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresaParams}/>
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

                <TableComponent data={userData} empresa={empresaParams}/>
                </>

                )}
                {showCreateUserForm && (
                <>
                    <div className={styles.formHeader}>
                        <p>Cadastro/Edição</p>
                        <ArrowLeft className={styles.arrowLeft} onClick={ () =>handleShowCreateUserForm(false)} />
                    </div>

                    {/* Aqui eu estou passando a epresa da url para o forms */}
                    {empresaid && <CreateUserForm empresa={empresaParams} empresaid={empresaid}/>}
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
        </div>
    )
}