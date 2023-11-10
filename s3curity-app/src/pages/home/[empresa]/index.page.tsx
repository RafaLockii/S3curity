import SidebarMenu from "@/components/SideBarMenu";
import styles from './styles.module.css';
import { Header } from "@/components/header";
import CarouselComponent from "@/components/Carousel";
import userRouter from 'next/router';
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface ImagemProps {
    img01: string;
    img02: string;
    img03: string;
    logo: string;
}

export default function Home() {
    
const{query} = userRouter;
const empresa = typeof query.empresa == 'string' ? query.empresa : "";
const {user} = useUserContext();

const [images, setImages] = useState<ImagemProps>({
    img01: '',
    img02: '',
    img03: '',
    logo: ''
});

useEffect(() => {
    async function fetchData() {
        try {
            if (empresa) {
                console.log("Empresa params: " + empresa);
                const response = await api.get(`empresa_name/${empresa}`);
                response.data.formattedEmpresa.carrosseis.map((item: any) => {
                    console.log(item.nome)
                });
                setImages({
                    img01: response.data.formattedEmpresa.carrosseis[0].nome,
                    img02: response.data.formattedEmpresa.carrosseis[1].nome,
                    img03: response.data.formattedEmpresa.carrosseis[2].nome,
                    logo: response.data.formattedEmpresa.logo
                });
                console.log("Imagens: " + images);
            }
        } catch (e) {
            console.log("CATCH Empresa: " + empresa);
            console.error("Erro: " + e);
        }
    }
    fetchData();
}, [empresa]);

    return (
       <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresa}/>
            <div className={styles.header}>
                <Header/>
            </div>
            <div className={styles.container}>
                <div className={styles.containerHeader}>
                    <p>Home</p>
                </div>
                    <CarouselComponent empresa={empresa} img01={images.img01} img02={images.img02} img03={images.img03} />
                <div className={styles.textContainer}>
                    <div className={styles.mainText}>
                        A Proteção da sua empresa é a nossa prioridade
                    </div>
                    <div className={styles.subText}>
                    Utilizamos as melhores práticas de segurança para ajudar sua empresa a detectar ameaças em tempo real, coletar e analisar dados para prevenir incidentes futuros, reagir prontamente a eventos de segurança e implementar medidas preventivas para manter a segurança de sua empresa, colaboradores e clientes em todos os momentos.
                    </div>
                </div>
            </div>
        </div>
    )
}