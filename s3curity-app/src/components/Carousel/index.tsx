import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';

export default function CarouselComponent(){
    return(
        <div className={styles.container}>
            <Carousel className={styles.Carousel}>
                <div>
                    <Image src={logo} alt =''/>
                </div>               
                <div>
                    <Image src={logo} alt =''/>
                </div>               
                <div>
                    <Image src={logo} alt =''/>
                </div>               
            </Carousel>
        </div>
    );
}