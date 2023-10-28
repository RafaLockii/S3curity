import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";

const registerFormShceme = z.object({
  nome: z.string(),
  razao_social: z.string(),
  logo: z.string(),
  background_img: z.string(),
  data_criacao: z.string(),
  usuario_criacao: z.string(),
  data_alteracao: z.string(),
  usuario_alteracao: z.string(),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Adicione a função setValue
  } = useForm<RegisterFormData>();

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
        <input
          className={styles.input}
          placeholder="Nome"
          {...register("nome")}
        ></input>
        <input
          type="text"
          id="razao_social"
          placeholder="Razão Social"
          {...register("razao_social")}
          className={styles.input}
        />
        <div className={styles.inputWithContents}>
          <input
            type="email"
            id="email"
            placeholder="Logo"
            {...register("logo")}
            className={styles.input}
          />
          <CloudArrowUp />
        </div>
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="telefone"
            placeholder="Imagem de fundo"
            {...register("background_img")}
            className={styles.input}
          />
            <CloudArrowUp />
        </div>
        <input
          className={styles.input}
          placeholder="Data de Criação"
          {...register("data_criacao")}
        ></input>
        <input
          className={styles.input}
          placeholder="Usuário de Criação"
          {...register("usuario_criacao")}
        ></input>
        <input
          className={styles.input}
          placeholder="Data de Alteração"
          {...register("data_alteracao")}
        ></input>
        <input
          className={styles.input}
          placeholder="Usuário de Alteração"
          {...register("usuario_alteracao")}
        ></input>
        
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
