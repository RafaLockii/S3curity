import FormLogin from '../../../components/FormsLogin/index';
import Carousel from '@/components/Carousel';
import styles from './styles.module.css';
import {useRouter} from 'next/router';

export default function SignIn() {

    const {query} = useRouter();
    const empresa = typeof query.empresa == 'string' ? query.empresa : "";

    return(
        <div className={styles.container}>
            <Carousel/>
            <FormLogin empresa={empresa}/>
        </div>
    )
}