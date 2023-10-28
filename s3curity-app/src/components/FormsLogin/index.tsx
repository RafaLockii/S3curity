import { useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";

const registerFormShceme = z.object({
    email: z.string().email({message: 'E-mail inválido'}),
    senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
})


type RegisterFormData = z.infer<typeof registerFormShceme>
export default function FormLogin(){
    const { 
        register,
        handleSubmit, 
        formState:{ errors, isSubmitting}
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormShceme),
    });

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
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {errors.senha && <div className={styles.formAnnotation}>{errors.senha.message}</div>}
            </form>
        </div>
    )
}