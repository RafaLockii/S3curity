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
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';


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
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };
    
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
    
        setOpen(false);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);   

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // async funtion handleSendEmail(email: string){

    // }
    async function handleEmailRegister(data: RegisterFormData){
        try{
            const response = await api.post('activate-2fa', {
                email: data.email,
            });
            if(response.status === 200){
                setShowEmailButton(false);
                setOpen(true);
                // setMessage('Email enviado com sucesso');
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
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                // sx={{
                //     position: 'fixed',
                //     top: '20px', /* Adjust as needed */
                //     left: '50%',
                //     transform: 'translateX(-50%)',
                //     zIndex: '9999',
                // }}
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Email enviado com sucesso! 
                    </Alert>
                </Snackbar>
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
                    {/* <input className={styles.input} placeholder="Email" {...register('email')} /> */}
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
                    {/* <button className={styles.button} type="submit">
                        Enviar e-mail para redefinição de senha
                    </button> */}
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
                    >
                    Enviar e-mail para redefinição de senha
                    </LoadingButton>
                    </>
                )}
                {!showEmailButton && (
                    <>
                    {/* <input className={styles.input} placeholder="Token" {...register('token')} /> */}
                    {/* <input className={styles.input} placeholder="Nova Senha" {...register('newPassword')} /> */}
                    <FormControl sx={{margin: '0.5rem 0 0.25rem 0', width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Token</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type='text'
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label=""
                            edge="end"
                            >
                            <KeyIcon />
                            </IconButton>
                        </InputAdornment>
                        }
                        label="Token"
                        {...register('token')}
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
                        {...register('newPassword')}
                    />
                    </FormControl>
                    {/* <button className={styles.button} type="submit">
                        Redefinir Senha
                    </button> */}
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
                    >
                    Redefinir Senha
                    </LoadingButton>
                    {errors.token && <div className={styles.formAnnotation}>{errors.token.message}</div>}
                    {errors.newPassword && <div className={styles.formAnnotation}>{errors.newPassword.message}</div>}
                    </>
                )}
                {errors.email && <div className={styles.formAnnotation}>{errors.email.message}</div>}
                {/* {message && <div className={styles.formAnnotationSuccess}>{message}</div>} */}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
                
            </form>

        </div>
    )
}