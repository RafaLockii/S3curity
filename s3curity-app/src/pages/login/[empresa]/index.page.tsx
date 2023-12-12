import FormLogin from '../../../components/FormsLogin/index';
import Carousel from '@/components/Carousel';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Slide, Slider, SliderProps } from '@/components/commons/Slider';
import { Card, CardMedia } from '@mui/material';

export default function SignIn() {

    const {query} = useRouter();
    const empresa = query.empresa;
    // const empresa = typeof query.empresa == 'string' ? query.empresa : "";
    const [images, setImages] = useState<string[]>([]);
    const [logo, setLogo] = useState<string>("");
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const settings: SliderProps = {
        slidesPerView: 2.5,
        spaceBetween: 1,
        loop: true,
        
        
    };
    const router = useRouter();

    useEffect(() => {
        
        async function fetchData() {
            try {
                if (empresa) {
                    const response = await api.get(`empresa-carrossel-logo/${empresa}`);

                    response.data.empresa.carrosseis.map((item: any) => {
                        setImages(prevImages => [...prevImages, item.nome]);
                    })
                    setLogo(response.data.empresa.logo);
                    window.localStorage.setItem('logo', JSON.stringify(response.data.empresa.logo));
                    window.localStorage.setItem('empresa', JSON.stringify({
                        empresa: empresa,
                    }));

                    
                }
            } catch (e) {
                console.log("CATCH Empresa: " + empresa);
                console.error("Erro: " + e);
            }
        }
        fetchData();
    }, [empresa]);


    const isClientSide = typeof window !== 'undefined';
    if(isClientSide){
    // window.localStorage.setItem('images', JSON.stringify(images));
    // window.localStorage.setItem('logo', JSON.stringify(logo));
    const storedUserData = window.localStorage.getItem('user');
    
    if(storedUserData){
        router.push(`/home/${empresa}`)
    }
    }
    
    return(
        <div className={styles.container}>
            {/* <Carousel empresa={empresa as string} images={images}/> */}
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
                        minWidth: 750,
                        maxWidth: 1250,
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
            <FormLogin empresa={empresa as string} logoUrl={logo}/>
        </div>
    )
}

//TODO:
// PRECISO QUE RETORNE O CARROSSEL DE IMAGENS NO GETEMPRESA BY NAME, PARA QU EU POSSA USAR NO LOGIN