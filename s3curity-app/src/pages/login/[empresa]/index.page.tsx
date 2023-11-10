import FormLogin from '../../../components/FormsLogin/index';
import Carousel from '@/components/Carousel';
import styles from './styles.module.css';
import {useRouter} from 'next/router';
import { use, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { useImageContext } from '@/context/imagesContext';
import { set } from 'zod';

interface ImagemProps {
    img01: string;
    img02: string;
    img03: string;
    logo: string;
}


export default function SignIn() {

    const {query} = useRouter();
    const empresa = typeof query.empresa == 'string' ? query.empresa : "";
    const { image, setImage } = useImageContext();
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
                    setImage({
                        logo: response.data.formattedEmpresa.logo
                    })
                    console.log("Imagens: " + images);
                }
            } catch (e) {
                console.log("CATCH Empresa: " + empresa);
                console.error("Erro: " + e);
            }
        }
        fetchData();
    }, [empresa]);
        

    return(
        <div className={styles.container}>
            <Carousel empresa={empresa} img01={images.img01} img02={images.img02} img03={images.img03}/>
            <FormLogin empresa={empresa} logoUrl={images.logo}/>
        </div>
    )
}