import SidebarMenu from "@/components/SideBarMenu";
import styles from './styles.module.css';
import { Header } from "@/components/header";
import CarouselComponent from "@/components/Carousel";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Slide, Slider, SliderProps } from '@/components/commons/Slider';
import { Card, CardMedia } from '@mui/material';

export default function Home() {
    const[empresa, setEmpresa] = useState<string>();
    // const{query} = userRouter;
    // const empresa = typeof query.empresa == 'string' ? query.empresa : "";
    const {user} = useUserContext();

    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const settings: SliderProps = {
        slidesPerView: 2.5,
        spaceBetween: 1,
        loop: true,
        loopAddBlankSlides: true,
        
        
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setEmpresa(JSON.parse(window.localStorage.getItem('empresa') || '{}').empresa || '');
                if (empresa) {
                    const response = await api.get(`empresa_name/${empresa}`);
                    console.log("Imagens da api: " + response.data.formattedEmpresa.carrosseis);

                    const imageNames = response.data.formattedEmpresa.carrosseis.map((item: any) => item.nome);
                    setImages(imageNames);
                }
            } catch (e) {
                console.error("Erro: " + e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [empresa]);

    if (loading) {
        // You can render a loading spinner or message here while data is being fetched.
        return <p>Loading...</p>;
    }
        
        return (
        <div className={styles.pageContainer}>
                <SidebarMenu empresa={empresa as string}/>
                <div className={styles.header}>
                    <Header/>
                </div>
                
                <div className={styles.container}>
                <div className={styles.containerHeader}>
                        <p>Home</p>
                    </div>
                        {images && (
                            // <CarouselComponent empresa={empresa as string} images={images}/>
                            <Slider settings={settings}>
                                {images.map((image, index) => (
                                    <Slide key={index}>
                                        <CardMedia
                                        component="img"
                                        alt="green iguana"
                                        height="140"
                                        image={image}
                                        key={index}
                                        sx={{
                                        minWidth: 225,
                                        maxWidth: 750,
                                        minHeight: 450,
                                        maxHeight: 550,
                                        borderRadius: 2,
                                        transition: 'transform 0.3s',
                                        cursor: 'pointer',
                                        transform: hoveredCard === index ? 'scale(1)' : 'scale(0.8)',
                                        }}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                        />
                                    </Slide>
                                ))}
                            </Slider>
                        )}
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