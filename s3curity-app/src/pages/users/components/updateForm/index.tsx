import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import Select from "react-select";
import { useRouter } from "next/router";

interface updateFormProps {
  nome: string;
  senha: string;
  email: string;
  telefone: string;
  img_url: string;
}

const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
  email: z.string().email({message: 'Formato de e-mail invalido'}),
  telefone: z.string().refine((value) => {
    return /^\d+$/.test(value) && value.length >= 8;
  }, { message: 'Telefone inválido' }),
  img_url: z.string().min(1, {message: 'Preencha o campo'}).refine((value) => {
    // Verifica se a img_url é uma URL válida (formato básico)
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

  const router = useRouter();

  async function handleRegister(data: RegisterFormData) {
    console.log(data);
  }

  return (
    <div>
      <div className={styles.formHeader}>
        <p>Edição</p>
        <ArrowLeft className={styles.arrowLeft} />
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
        <div className={styles.inputWithContents}>
            <input
            className={styles.input}
            placeholder="Nome"
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
        </div>
        <div className={styles.inputWithContents}>
            <input
            type="email"
            id="email"
            placeholder="email"
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
            placeholder="Telefone"
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
            id="img_url"
            placeholder="Imagem de fundo"
            {...register("img_url")}
            className={styles.input}
          />
            <CloudArrowUp />
            {errors.img_url &&(
                <div className={styles.formAnnotation}>
                    {errors.img_url.message}
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
