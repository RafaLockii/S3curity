import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";

const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  razao_social: z.string().refine((value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.length === 14;
  }, { message: 'CNPJ inválido' }),
  logo: z.string().min(1, {message: 'Preencha o campo'}),
  background_img: z.string().min(1, {message: 'Preencha o campo'}),
  data_criacao: z.string().min(1, {message: 'Preencha o campo'}),
  usuario_criacao: z.string().min(1, {message: 'Preencha o campo'}),
  data_alteracao: z.string().min(1, {message: 'Preencha o campo'}),
  usuario_alteracao: z.string().min(1, {message: 'Preencha o campo'}),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateForm() {
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
        <p>Cadastro/Edição</p>
        <ArrowLeft className={styles.arrowLeft} />
      </div>
      <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Nome"
            {...register("nome")}
          ></input>
          {errors.nome && (
            <div className={styles.formAnnotation}>{errors.nome.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="razao_social"
            placeholder="Razão Social"
            {...register("razao_social")}
            className={styles.input}
          />
          {errors.razao_social && (
            <div className={styles.formAnnotation}>{errors.razao_social.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="logo"
            placeholder="Logo"
            {...register("logo")}
            className={styles.input}
          />
          <CloudArrowUp />
          {errors.logo && (
            <div className={styles.formAnnotation}>{errors.logo.message}</div> 
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="background_img"
            placeholder="Imagem de fundo"
            {...register("background_img")}
            className={styles.input}
          />
            <CloudArrowUp />
          {errors.background_img && (
            <div className={styles.formAnnotation}>{errors.background_img.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Data de Criação"
            {...register("data_criacao")}
          ></input>
          {errors.data_criacao && (
            <div className={styles.formAnnotation}>{errors.data_criacao.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Usuário de Criação"
            {...register("usuario_criacao")}
          ></input>
          {errors.usuario_criacao && (
            <div className={styles.formAnnotation}>{errors.usuario_criacao.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Data de Alteração"
            {...register("data_alteracao")}
          ></input>
          {errors.data_alteracao && (
            <div className={styles.formAnnotation}>{errors.data_alteracao.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Usuário de Alteração"
            {...register("usuario_alteracao")}
          ></input>
          {errors.usuario_alteracao && (
            <div className={styles.formAnnotation}>{errors.usuario_alteracao.message}</div>
          )}
        </div>
        
        <button
        className={styles.createUserButton}
        type="submit"
      >
        Salvar
      </button>
      </form>

    </div>
  );
}
