import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useImageContext } from '@/context/imagesContext';



export function Header() {
    const { image, setImage } = useImageContext();
    return(
        <header>
            <div className={styles.Content}>
                <section className={styles.sectionContent}>
                    <Image 
                        src={image?.logo || logo}
                        alt='Logo'
                        quality={100}
                        width={200}
                        height={50}
                    />
                    <hr className={styles.divisor}/>
                    <h1 className={styles.operacional}>OPERACIONAL</h1>
                </section>
            </div>
        </header>
        )
}