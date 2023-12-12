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
import TextField from "@mui/material/TextField";
import { ErrorSharp } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

const registerFormShceme = z.object({
    email: z.string().email({message: 'Formato de e-mail invalido'}),
    token: z.string().min(6, {message: 'O token precisa ter pelo menos 6 caracteres'}),
})


type RegisterFormData = z.infer<typeof registerFormShceme>

// const[showKey, setShowKey] = useState();
export default function ActivateUser(){
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormShceme),
    });

    const router = useRouter();
    const {back} = router;
    const[showEmailButton, setShowEmailButton] = useState(true);
    const[message, setMessage] = useState('');
    const[errorMessage, setErrorMessage] = useState('');
    const[loadingRequest, setLoadingRequest] = useState(false);

    async function handleEmailRegister(data: RegisterFormData){
        try{
            setLoadingRequest(true);
            const response = await api.post('user/ativar', {
                email: data.email,
                token: data.token
            });
            if(response.status === 200){
                setMessage('Conta validada com sucesso');
                setErrorMessage('');
            }
        }catch(e){
            setLoadingRequest(false)

            setErrorMessage('Credênciais Inválidas');
        }
        setLoadingRequest(false)
    }

    async function handleCloseButtonClick(){
        await back();
    }
    

    return(
        <div className={styles.formContainer}>
            <Image src={logo} alt ='' className={styles.logo}/>
            <div className={styles.rowContainer}>
                <p>Ativar Conta</p>
                <button className={styles.closeButton} onClick={handleCloseButtonClick}>X</button>
            </div>
            <form onSubmit={handleSubmit(handleEmailRegister)}>
                    <>
                    <p className={styles.text}>
                        Digite o endereço de email e o token de verificação
                       
                    </p>
                    <TextField
                    id="email"
                    label="Email"
                    variant="outlined"
                    {...register('email')}
                    sx={{  margin: ' 1rem 0 0 0',width: '100%',  }}
                    error={errors.email ? true : false}
                    helperText={errors.email ? errors.email.message : ''}
                    />
                    <TextField
                    id="token"
                    label='Token'
                    {...register('token')}
                    variant='outlined'
                    sx={{margin: ' 1rem 0 1rem 0',width: '100%'}}
                    error={errors.token ? true : false}
                    helperText={errors.token ? errors.token.message : ''}
                    />
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
                    loading={loadingRequest}
                    >
                    Ativar Conta
                    </LoadingButton>
                    
                    </>
                {message && <div className={styles.formAnnotationSuccess}>{message}</div>}
                {errorMessage && <div className={styles.formAnnotation}>{errorMessage}</div>}
            </form>

        </div>
    )
}