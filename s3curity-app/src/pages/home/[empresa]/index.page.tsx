import SidebarMenu from "@/components/SideBarMenu";
import styles from './styles.module.css';
import { Header } from "@/components/header";
import CarouselComponent from "@/components/Carousel";
import userRouter from 'next/router';

export default function Home() {
    
const{query} = userRouter;
const empresa = typeof query.empresa == 'string' ? query.empresa : "";

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
                <div className={styles.carouselContainer}>
                    <CarouselComponent/>
                </div>
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