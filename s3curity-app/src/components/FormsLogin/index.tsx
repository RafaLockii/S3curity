import { useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";

const registerFormShceme = z.object({
    email: z.string(),
    senha: z.string()
})


type RegisterFormData = z.infer<typeof registerFormShceme>
export default function FormLogin(){
    const { 
        register,
        handleSubmit, 
        formState:{ errors, isSubmitting}
    } = useForm<RegisterFormData>();

    const router = useRouter();

    async function handleRegister(data: RegisterFormData){
        await console.log(data);
        await router.push('/home');
    }

    async function handleForgotpasswordClick(){
        await router.push('/forgotPassword');
    }
    

    return(
        <div className={styles.formContainer}>
            <Image src={logo} alt ='' className={styles.logo}/>
            <form onSubmit={handleSubmit(handleRegister)}>
                <input className={styles.input} placeholder="Email" {...register('email')} ></input>
                
                <input type="password" id="senha" placeholder="Senha" {...register('senha')} className={styles.input}/>

                <div className={styles.forgotPassword} onClick={handleForgotpasswordClick}> Esqueceu a senha?</div>

                <button className={styles.button} type="submit">
                    Entrar
                </button>
            </form>
        </div>
    )
}