import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import UpdateForm from "../components/updateForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import  useRouter from "next/router";
import { api } from "@/lib/axios";

interface UserData {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    acesso_admin: boolean;
    ativo: boolean;
    funcionario: {
      acesso_admin: boolean;
      ativo: boolean;
      imagem: { url: string };
      cargo: { nome_cargo: string; permissoes: string };
      empresa: { nome: string };
    }
  }

export default function editUsers(){
    
    const [userData, setUserData] = useState<UserData>();


        //Resgatando data da URL
    const {query, back} = useRouter;
    const id = query.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`user/${id}`);
                setUserData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    
        fetchData();
    }, []);

    console.log(userData);

    


    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={""}/>
            {userData ? ( // Verifique se userData está definido
                <div className={styles.createUserFormContainer}>
                    {/* <div className={styles.formHeader}>
                        Usuário
                        <div className={styles.headerButtonContainer}>
                            <button className={styles.headerButton}>
                                Copiar
                            </button>
                        </div>
                    </div> */}

                    <div className={styles.formHeader}>
                        <p>Edição</p>
                        <ArrowLeft className={styles.arrowLeft} onClick={() => back()} />
                    </div>

                    {/* Renderize o UpdateForm somente se userData estiver definido */}
                    {userData && (
                        <UpdateForm
                            acesso_admin={userData.acesso_admin}
                            ativo={userData.ativo}
                            email={userData.email}
                            id={userData.id}
                            nome={userData.nome}
                            funcionario={userData.funcionario}
                            telefone={userData.telefone}
                        />
                    )}
                </div>
            ) : (
                <div>Carregando...</div>
            )}
            <div className={styles.header}>
                <Header/>
            </div>            
        </div>
    )
}