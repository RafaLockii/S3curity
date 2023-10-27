import FormLogin from '../../components/FormsLogin/index';
import Carousel from '@/components/Carousel';
import styles from './styles.module.css'

export default function SignIn() {
    return(
        <div className={styles.container}>
            <Carousel/>
            <FormLogin/>
        </div>
    )
}