import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

interface updateFormProps {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  acesso_admin: boolean;
  ativo: boolean;
  funcionario: {
    acesso_admin: boolean;
    ativo: boolean;
    imagem: { url: string };
    cargo: { nome_cargo: string; permissoes: string };
    empresa: { nome: string };
  }
}

//Interface de dados da empresa
interface EmpresaData {
  id: number;
  nome: string;
  cnpj: string;
  logo: string;
  data_alt: any;
  data_criacao: string;
  imagem_fundo: string;
  usuario_criacao: string;
  usuario_cad_alt: any;
}

const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  // senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
  email: z.string().email({message: 'Formato de e-mail invalido'}),
  telefone: z.string().refine((value) => {
    return /^\d+$/.test(value) && value.length >= 8;
  }, { message: 'Telefone inválido' }),
  imagem_perfil_url: z.string().min(1, {message: 'Preencha o campo'}).refine((value) => {
    // Verifica se a imagem_perfil_url é uma URL válida (formato básico)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(value);
  }, { message: 'URL da imagem inválida' }),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function UpdateForm(props: updateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Adicione a função setValue
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormShceme),
  });

  const {back} = useRouter();


    

  //Bloco que popula na api
  async function handleRegister(data: RegisterFormData) {
    await api.put(`user/edit/${props.id}`, {
      "nome": data.nome,
      "email": data.email,
      "telefone": data.telefone,
      "imagem_perfil_url": data.imagem_perfil_url,
      // cargo id e empresasão obrigatorios(  PRECISA IMPLPEMENTAR MANEIRA DE PEGAR ELES )
      "cargo_id": 1,
      "empresa_id": 1,
    });

    back();
  }
  //fim do bloco

  //Função utilizada para já deixar os dados do usuário preenchidos no formulário
  useEffect(() => {
    setValue('nome', props.nome);
    setValue('email', props.email);
    setValue('telefone', props.telefone);
    setValue('imagem_perfil_url', props.funcionario.imagem.url);
  }, [props]); 

  return (
    <div>

      <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
        <div className={styles.inputWithContents}>
            <input
            className={styles.input}
            placeholder={props.nome}
            {...register("nome")}
            ></input>
            {errors.nome &&(
                <div className={styles.formAnnotation}>
                    {errors.nome.message}
                </div>
            )}
        </div>
        {/* <div className={styles.inputWithContents}>
            <input
            type="senha"
            id="senha"
            placeholder="Senha"
            {...register("senha")}
            className={styles.input}
            />
            {errors.senha &&(
                <div className={styles.formAnnotation}>
                    {errors.senha.message}
                </div>
            )}
        </div> */}
        <div className={styles.inputWithContents}>
            <input
            type="email"
            id="email"
            placeholder={props.email}
            {...register("email")}
            className={styles.input}
            />
            {errors.email &&(
                <div className={styles.formAnnotation}>
                    {errors.email.message}
                </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            type="number"
            id="telefone"
            placeholder={props.telefone}
            {...register("telefone")}
            className={styles.input}
            />
            {errors.telefone &&(
                <div className={styles.formAnnotation}>
                    {errors.telefone.message}
                </div>
                )}
       </div>  
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="imagem_perfil_url"
            placeholder={props.funcionario.imagem.url}
            {...register("imagem_perfil_url")}
            className={styles.input}
          />
            <CloudArrowUp />
            {errors.imagem_perfil_url &&(
                <div className={styles.formAnnotation}>
                    {errors.imagem_perfil_url.message}
                </div>
            )}
        </div>
        
      </form>


      <button
        className={styles.createUserButton}
        type="submit"
        onClick={handleSubmit(handleRegister)}
      >
        Salvar
      </button>
    </div>
  );
}
