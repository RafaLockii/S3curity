'use client'
// this useclient forcers this page to be rendered in the client side of the app
import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import UpdateForm from "../../../components/UpdateFormEmpresa";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import  useRouter from "next/router";
import  api  from "@/lib/axios";
import { EmpresaData } from "@/types/types";


export default function EditUsers(){
    
    const [empresaData, setempresaData] = useState<EmpresaData>();
    const [empresaName, setEmpresaName] = useState('');
    const[loading, setLoagin] = useState(true);
    const {back} = useRouter;

    
    useEffect(() => {
        const fetchData = async () => {
            const {query} = useRouter;
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
            } else {
                // A variável data está vazia
            }
            setEmpresaName(data[1]);
            try {
                const response = await api.get(`empresa/${data[0]}`);
                setempresaData(response.data);
            } catch (error) {
                console.error(error);
            }
            setLoagin(false)
        }
    
        fetchData();
    }, []);

        //Resgatando data da URL
    


    return(
        <div className={styles.pageContainer}>
            {!loading && (
            <>
            <SidebarMenu empresa={empresaName}/>
            {empresaData ? ( // Verifique se empresaData está definido
                <div className={styles.createUserFormContainer}>
                    <div className={styles.formHeader}>
                        <p style={{marginLeft: '1.5rem'}}>Edição</p>
                        <ArrowLeft className={styles.arrowLeft} onClick={() => back()} />
                    </div>

                    {/* Renderize o UpdateForm somente se empresaData estiver definido */}
                    {empresaData && (
                        <UpdateForm
                            id={empresaData.id}
                            nome={empresaData.nome}
                            razao_s={empresaData.razao_s}
                            logo={empresaData.logo}
                            data_alt={empresaData.data_alt}
                            data_criacao={empresaData.data_criacao}
                            imagem_fundo={empresaData.imagem_fundo}
                            usuario_criacao={empresaData.usuario_criacao}
                            usuario_cad_alt={empresaData.usuario_cad_alt}
                            carrosseis={empresaData.carrosseis}
                        />
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