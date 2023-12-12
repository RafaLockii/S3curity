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
// import { useUserContext } from '@/context/UserContext'; // Importe o UserContext com a tipagem
import { useImageContext } from '@/context/imagesContext'; // Importe o ImageContext com a tipagem
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from "next/link";

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
    // const { user, setUser } = useUserContext();
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
                if(response.data.ativo == false){
                    setErrorMessage("Conta desativada, ative sua conta para prosseguir");
                    setLoadingRequest(false);
                } else if(response.data.ativo == true){
                    window.localStorage.setItem('user', JSON.stringify({
                        id: response.data.id,
                        token: response.data.token,
                        email: response.data.email,
                        nome: response.data.nome,
                        acesso_admin: response.data.isAdmin,
                        verified: response.data.ativo,
                    }));
                    await router.push(`/home/${empresa}`);
                    setLoadingRequest(false); // Quando a requisição terminar, sete o estado para false
                } else{
                    alert("Erro desconhecido, entre em contato com o suporte");
                    setLoadingRequest(false);
                }

            } else if (response.status === 404) {
                setErrorMessage("Credenciais inválidas");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            setErrorMessage("Credenciais inválidas");
            setLoadingRequest(false);
        }
    }

    // async function handleForgotpasswordClick() {
    //     await router.push('/forgotPassword');
    // }

    // async function handleActivateuser(){
    //     await router.push('/activate')
    // }

    return (
        <div className={styles.formContainer}>
            <img src={logoUrl} alt='' className={styles.logo} />
            <form onSubmit={handleSubmit(handleRegister)} autoComplete="off">
                <FormControl sx={{margin: '0.5rem 0 0.25rem 0', width: '100%' }} variant="outlined">
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

                <FormControl sx={{margin: '0.5rem 0 0.25rem 0', width: '100%' }} variant="outlined">
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
                <Link href={`/forgotPassword`}>
                <div className={styles.forgotPassword}> Esqueceu a senha?</div>
                </Link>
                <LoadingButton
                    sx={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#000000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBotton: '1rem',
                    }}
                    type="submit"
                    loading={laodingRequest}
                    >
                    Entrar
                </LoadingButton>
                <Link href={`/activate`}>
                <div className={styles.activate}> Ativar Conta</div>
                </Link>
                
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {errors.senha && <div className={styles.formAnnotation}>{errors.senha.message}</div>}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
            </form>
        </div>
    );
}
