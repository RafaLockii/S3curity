import { useForm } from "react-hook-form";
import {z} from 'zod';
import styles from './styles.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import { useRouter } from "next/router";
import { ArrowArcLeft, ArrowLeft } from "phosphor-react";
import Select from 'react-select'

const registerFormShceme = z.object({
    nome: z.string(),
    senha: z.string(),
    email: z.string().email(),
    telefone: z.string(),
    modulo: z.string(),
    ativo: z.boolean(),
    admin: z.boolean(),
})


type RegisterFormData = z.infer<typeof registerFormShceme>

export default function CreateUserForm(){
    const { 
        register,
        handleSubmit, 
        formState:{ errors, isSubmitting}
    } = useForm<RegisterFormData>();

    const options = [
        { value: 'operacional', label: 'Operacional' },
        { value: 'gerencial', label: 'Gerencial' },
        { value: 'estratégico', label: 'Estratégico' }
    ];

    const router = useRouter();

    async function handleRegister(data: RegisterFormData){
        await console.log(data);
    }

    async function handleForgotpasswordClick(){
        await router.push('/forgotPassword');
    }
    

    return(
        <div>
            <div className={styles.formHeader}>
                <p>
                Cadastro/Edição
                </p>
                <ArrowLeft className={styles.arrowLeft}/>
            </div>
            <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
                <input className={styles.input} placeholder="Nome" {...register('nome')} ></input>               
                <input type="password" id="senha" placeholder="Senha" {...register('senha')} className={styles.input}/>
                <input type="email" id="email" placeholder="E-mail" {...register('email')} className={styles.input}/>
                <input type="text" id="telefone" placeholder="Telefone" {...register('telefone')} className={styles.input}/>
                <Select options={options} className={styles.input} {...register} placeholder='Modulo Default'/>

                <div className={styles.inputWithContents}>
                    <div className={styles.input}>
                        Ativo
                    </div>
                    <input type="checkbox" id="ativo" {...register('ativo')} className={styles.checkbox}/>
                </div>
                <div className={styles.inputWithContents}>
                    <div className={styles.input}>
                        Administrador
                    </div>
                    <input type="checkbox" id="admin" {...register('admin')} className={styles.checkbox}/>
                </div>
                
            </form>
            <button className={styles.createUserButton} type="submit">
                Salvar
            </button>
        </div>
    )
}