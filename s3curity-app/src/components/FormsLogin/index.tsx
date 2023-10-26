import { useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';

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
    } = useForm();

    async function handleRegister(data: RegisterFormData){
        console.log(data);
    }

    return(
        <div className={styles.formContainer}>
            <form>
                <input className={styles.input} placeholder="Email" {...register('email')}></input>
                
                <input type="password" id="senha" placeholder="Senha" {...register('senha')} className={styles.input}/>

                <button className={styles.button} type="submit">
                    Entrar
                </button>
            </form>
        </div>
    )
}