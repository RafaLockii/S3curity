import { useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { X } from 'phosphor-react'

const registerFormShceme = z.object({
    email: z.string(),
})


type RegisterFormData = z.infer<typeof registerFormShceme>
export default function FormForgotPassWord(){
    const { 
        register,
        handleSubmit, 
        formState:{ errors, isSubmitting}
    } = useForm<RegisterFormData>();

    const router = useRouter();
    const {back} = router;

    async function handleRegister(data: RegisterFormData){
        await console.log(data);
    }

    async function handleCloseButtonClick(){
        await back();
    }
    

    return(
        <div className={styles.formContainer}>
            <Image src={logo} alt ='' className={styles.logo}/>
            <div className={styles.rowContainer}>
                <p>Redefinir senha</p>
                <button className={styles.closeButton} onClick={handleCloseButtonClick}>X</button>
            </div>
            <form onSubmit={handleSubmit(handleRegister)}>

                <p className={styles.text}> Digite o endereço de email<br/> Enviaremos a você um link para redefinir sua <br/> senha.</p>
                <input className={styles.input} placeholder="Email" {...register('email')} ></input>
                <button className={styles.button} type="submit">
                    Enviar e-mail para redefinição de senha
                </button>
            </form>
        </div>
    )
}