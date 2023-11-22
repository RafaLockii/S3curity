// FormLogin.tsx
import React, { useContext, useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useUserContext } from '@/context/UserContext'; // Importe o UserContext com a tipagem
import { useImageContext } from '@/context/imagesContext'; // Importe o ImageContext com a tipagem
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LoadingButton from '@mui/lab/LoadingButton';

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
    const [showPassword, setShowPassword] = React.useState(false);
    const[laodingRequest, setLoadingRequest] = useState(false); // Crie um estado para o carregamento da requisição [loadingRequest]

    const handleClickShowPassword = () => setShowPassword((show) => !show);   

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    async function handleRegister(data: RegisterFormData) {
        setLoadingRequest(true); // Quando a requisição começar, sete o estado para true
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
                setLoadingRequest(false); // Quando a requisição terminar, sete o estado para false

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
            <form onSubmit={handleSubmit(handleRegister)} autoComplete="off">
                <FormControl sx={{ m: 1, width: '27ch',  }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type='text'
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label=""
                        edge="end"
                        >
                        <EmailIcon />
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                    {...register('email')}
                />
                </FormControl>

                <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                    label="Password"
                    {...register('senha')}
                />
                </FormControl>

                <div className={styles.forgotPassword} onClick={handleForgotpasswordClick}> Esqueceu a senha?</div>
                <LoadingButton
                    className={styles.button}
                    type="submit"
                    loading={laodingRequest}
                    >
                    Entrar
                </LoadingButton>
                
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {errors.senha && <div className={styles.formAnnotation}>{errors.senha.message}</div>}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
            </form>
        </div>
    );
}
