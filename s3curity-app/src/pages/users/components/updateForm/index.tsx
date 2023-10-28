import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";

const registerFormShceme = z.object({
  nome: z.string(),
  senha: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  img_url: z.string()
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function UpdateForm() {
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
        <p>Edição</p>
        <ArrowLeft className={styles.arrowLeft} />
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Nome"
          {...register("nome")}
        ></input>
        <input
          type="password"
          id="senha"
          placeholder="Senha"
          {...register("senha")}
          className={styles.input}
        />
        <input
        type="email"
        id="email"
        placeholder="email"
        {...register("email")}
        className={styles.input}
        />
        <input
        type="number"
        id="telefone"
        placeholder="Telefone"
        {...register("telefone")}
        className={styles.input}
        />     
        <div className={styles.inputWithContents}>
          <input
            type="text"
            id="telefone"
            placeholder="Imagem de fundo"
            {...register("telefone")}
            className={styles.input}
          />
            <CloudArrowUp />
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
