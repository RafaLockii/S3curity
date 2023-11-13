// FormLogin.tsx
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useUserContext } from '@/context/UserContext'; // Importe o UserContext com a tipagem
import { useImageContext } from '@/context/imagesContext'; // Importe o ImageContext com a tipagem

const registerFormScheme = z.object({
    email: z.string().email({ message: 'E-mail inválido' }),
    senha: z.string().min(8, { message: 'A senha precisa ter pelo menos 8 caracteres' }),
});

interface FormLoginProps {
    empresa: string;
    logoUrl: string;
}

type RegisterFormData = z.infer<typeof registerFormScheme>;

export default function FormLogin({ empresa, logoUrl }: FormLoginProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormScheme),
    });

    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    //Utilização do contexto
    const { user, setUser } = useUserContext();
    const [userLocalStorage, setUserLocalStorage] = useState(); // Crie um estado para o usuário logado [userLocalStorage]
    const { image, setImage } = useImageContext();

    async function handleRegister(data: RegisterFormData) {
        try {
            const response = await api.post('login', {
                email: data.email,
                senha: data.senha,
            });

            if (response.status === 200) {
                console.log(response.data);
                setUser({
                    id: response.data.id,
                    token: response.data.token,
                    email: response.data.email,
                    nome: response.data.nome,
                    acesso_admin: response.data.isAdmin,
                });

                localStorage.setItem('user', JSON.stringify({
                    id: response.data.id,
                    token: response.data.token,
                    email: response.data.email,
                    nome: response.data.nome,
                    acesso_admin: response.data.isAdmin,
                }));
                
                await router.push(`/home/${empresa}`);
            } else if (response.status === 404) {
                setErrorMessage("Credenciais inválidas");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setErrorMessage("Credenciais inválidas");
        }
    }

    async function handleForgotpasswordClick() {
        await router.push('/forgotPassword');
    }

    return (
        <div className={styles.formContainer}>
            <img src={logoUrl} alt='' className={styles.logo} />
            <form onSubmit={handleSubmit(handleRegister)}>
                <input className={styles.input} placeholder="Email" {...register('email')} />

                <input type="password" id="senha" placeholder="Senha" {...register('senha')} className={styles.input} />

                <div className={styles.forgotPassword} onClick={handleForgotpasswordClick}> Esqueceu a senha?</div>

                <button className={styles.button} type="submit">
                    Entrar
                </button>
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {errors.senha && <div className={styles.formAnnotation}>{errors.senha.message}</div>}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
            </form>
        </div>
    );
}
