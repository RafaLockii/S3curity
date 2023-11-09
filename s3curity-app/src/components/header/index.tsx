import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';

interface HeaderProps {
    logoUrl: string;
}

export function Header({logoUrl}: HeaderProps) {
    return(
        <header>
            <div className={styles.Content}>
                <section className={styles.sectionContent}>
                    <Image 
                        src={logoUrl}
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