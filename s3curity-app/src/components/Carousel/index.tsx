import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './styles.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/lib/axios';

interface CarouselProps {
    empresa: string;
}

interface ImagemProps {
    img01: string;
    img02: string;
    img03: string;
    logo: string;
}

export default function CarouselComponent({ empresa }: CarouselProps) {
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
                    const response = await api.get(`logo/${empresa}`);
                    setImages({
                        img01: response.data.carrosseis[0].imagem_1,
                        img02: response.data.carrosseis[0].imagem_2,
                        img03: response.data.carrosseis[0].imagem_3,
                        logo: response.data.logo
                    });
                    console.log("Imagens: " + images);
                }
            } catch (e) {
                console.log("CATCH Empresa: " + empresa);
                console.error("Erro: " + e);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
          <Carousel swipeable={true} emulateTouch showThumbs={false}>
              <img src={images.img01} alt='' className={styles.carouselBox} />
              <img src={images.img02} alt='' className={styles.carouselBox} />
              <img src={images.img03} alt='' className={styles.carouselBox} />
          </Carousel>
        </div>
      );
}
