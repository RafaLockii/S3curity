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
        console.log("id recebido: " + id);
        console.log("empresa recebida: " + empresa);
      } else {
        // A variável data está vazia
        console.log('Nenhum parâmetro encontrado na URL');
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`user/${data[0]}`);
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
            <SidebarMenu empresa={data[1]}/>
            {userData ? ( // Verifique se userData está definido
                <div className={styles.createUserFormContainer}>
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