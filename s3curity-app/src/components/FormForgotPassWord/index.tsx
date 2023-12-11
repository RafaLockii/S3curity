import { set, useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { X } from 'phosphor-react'
import { useState } from "react";
import {api} from "@/lib/axios";
import { resolve } from "path";
import { zodResolver } from "@hookform/resolvers/zod";

const registerFormShceme = z.object({
    email: z.string().email({message: 'Formato de e-mail invalido'}),
    token: z.string().min(6, {message: 'O token precisa ter pelo menos 6 caracteres'}),
    newPassword: z.string().min(8, {message: 'A senha precisa ter pelo menos 8 caracteres'}),
})


type RegisterFormData = z.infer<typeof registerFormShceme>

// const[showKey, setShowKey] = useState();
export default function FormForgotPassWord(){
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        //resolver: zodResolver(registerFormShceme),
    });

    const router = useRouter();
    const {back} = router;
    const[showEmailButton, setShowEmailButton] = useState(true);
    const[message, setMessage] = useState('');
    const[errorMessage, setErrorMessage] = useState('');

    // async funtion handleSendEmail(email: string){

    // }
    async function handleEmailRegister(data: RegisterFormData){
        try{
            const response = await api.post('activate-2fa', {
                email: data.email,
            });
            if(response.status === 200){
                setShowEmailButton(false);
                setMessage('Email enviado com sucesso');
                setErrorMessage('');
            }
        }catch(e){
            setErrorMessage('Erro ao enviar email');
        }
       
    }
    async function handleResetPassword(data: RegisterFormData){

        try{
            const response = await api.post('verify-2fa', {
                email: data.email,
                code: data.token,
                newPassword: data.newPassword,
            });
            if(response.status === 200){
                setMessage('Senha Redefinida com sucesso');
                setTimeout(() => {
                    back(); // Chama 'back()' após um atraso de 2500 milissegundos (2.5 segundos)
                }, 2500);
            }
        }catch(e){
            setErrorMessage('Erro ao resetar a senha');
        }
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
            <form onSubmit={handleSubmit(showEmailButton ? handleEmailRegister : handleResetPassword)}>
                {showEmailButton && (
                    <>
                    <p className={styles.text}>
                        Digite o endereço de email
                        <br />
                        Enviaremos a você um link para redefinir sua <br /> senha.
                    </p>
                    <input className={styles.input} placeholder="Email" {...register('email')} />
                    <button className={styles.button} type="submit">
                        Enviar e-mail para redefinição de senha
                    </button>
                    </>
                )}
                {!showEmailButton && (
                    <>
                    <input className={styles.input} placeholder="Token" {...register('token')} />
                    <input className={styles.input} placeholder="Nova Senha" {...register('newPassword')} />
                    <button className={styles.button} type="submit">
                        Redefinir Senha
                    </button>
                    {errors.token && <div className={styles.formAnnotation}>{errors.token.message}</div>}
                    {errors.newPassword && <div className={styles.formAnnotation}>{errors.newPassword.message}</div>}
                    </>
                )}
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {message && <div className={styles.formAnnotationSuccess}>{message}</div>}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
            </form>

        </div>
    )
}