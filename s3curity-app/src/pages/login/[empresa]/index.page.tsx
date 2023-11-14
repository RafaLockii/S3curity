import FormLogin from '../../../components/FormsLogin/index';
import Carousel from '@/components/Carousel';
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

export default function SignIn() {

    const {query} = useRouter();
    const empresa = query.empresa;
    // const empresa = typeof query.empresa == 'string' ? query.empresa : "";
    const [images, setImages] = useState<string[]>([]);
    const [logo, setLogo] = useState<string>("");

    useEffect(() => {
        async function fetchData() {
            try {
                if (empresa) {
                    console.log("Empresa params: " + empresa);
                    const response = await api.get(`empresa_nome/${empresa}`);
                    console.log(response.data)

                    response.data.formattedEmpresa.carrosseis.map((item: any) => {
                        setImages(prevImages => [...prevImages, item.nome]);
                    })
                    setLogo(response.data.formattedEmpresa.logo);
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
    window.localStorage.setItem('images', JSON.stringify(images));
    }
    
    return(
        <div className={styles.container}>
            <Carousel empresa={empresa as string} images={images}/>
            <FormLogin empresa={empresa as string} logoUrl={logo}/>
        </div>
    )
}

//TODO:
// PRECISO QUE RETORNE O CARROSSEL DE IMAGENS NO GETEMPRESA BY NAME, PARA QU EU POSSA USAR NO LOGIN