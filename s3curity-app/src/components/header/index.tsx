import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';

export function Header() {
    return(
        <header>
            <div className={styles.Content}>
                <section className={styles.sectionContent}>
                    <Image 
                        src={logo}
                        alt='Logo'
                        quality={100}
                    />
                    <hr className={styles.divisor}/>
                    <h1 className={styles.operacional}>OPERACIONAL</h1>
                </section>
            </div>
        </header>
        )
}