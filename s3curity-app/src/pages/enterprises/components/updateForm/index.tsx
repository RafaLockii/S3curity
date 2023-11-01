import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

//Interface de dados da empresa
interface EmpresaData {
  id: number;
  nome: string;
  razao_s: string;
  logo: string;
  data_alt: any;
  data_criacao: string;
  imagem_fundo: string;
  usuario_criacao: string;
  usuario_cad_alt: any;
}

const registerFormShceme = z.object({
    nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s0-9]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
    razao_s: z.string().refine((value) => {
      const numericValue = value.replace(/\D/g, '');
      return numericValue.length === 14;
    }, { message: 'CNPJ inválido' }),
    logo: z.string().min(1, {message: 'Preencha o campo'}),
    imagem_fundo: z.string().min(1, {message: 'Preencha o campo'}),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function UpdateForm(props: EmpresaData) {
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
    await api.put(`empresa/edit/${props.id}`, {
      "nome": data.nome,
      "razao_s": data.razao_s,
      "logo": data.logo,
      "imagem_fundo": data.imagem_fundo,
      //Não vai mais precisar, vai ser algo feito elo back
      "data_alt": 1,
      //
      "usuario_cad_alt": "usuario_cad_alt",
      //"ativo": true,
    });

    back();
  }
  //fim do bloco

  //Função utilizada para já deixar os dados do usuário preenchidos no formulário
  useEffect(() => {
    setValue('nome', props.nome);
    setValue('razao_s', props.razao_s);
    setValue('logo', props.logo);
    setValue('imagem_fundo', props.imagem_fundo);
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
        <div className={styles.inputWithContents}>
            <input
            type="number"
            id="razao_s"
            placeholder={props.razao_s}
            {...register("razao_s")}
            className={styles.input}
            />
            {errors.razao_s &&(
                <div className={styles.formAnnotation}>
                    {errors.razao_s.message}
                </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            id="logo"
            placeholder={props.logo}
            {...register("logo")}
            className={styles.input}
            />
            {errors.logo &&(
                <div className={styles.formAnnotation}>
                    {errors.logo.message}
                </div>
                )}
       </div>  
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="imagem_fundo"
            placeholder={props.imagem_fundo}
            {...register("imagem_fundo")}
            className={styles.input}
          />
            <CloudArrowUp />
            {errors.imagem_fundo &&(
                <div className={styles.formAnnotation}>
                    {errors.imagem_fundo.message}
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
