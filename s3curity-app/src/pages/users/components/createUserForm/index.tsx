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
  modulo: z.string(),
  img_url: z.string(),
  ativo: z.boolean(),
  admin: z.boolean(),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Adicione a função setValue
  } = useForm<RegisterFormData>();

  const options = [
    { value: "operacional", label: "Operacional" },
    { value: "gerencial", label: "Gerencial" },
    { value: "estratégico", label: "Estratégico" },
  ];

  const router = useRouter();

  async function handleRegister(data: RegisterFormData) {
    console.log(data);
  }

  // Função de manipulação para o evento onChange do Select
  const handleSelectChange = (selectedOption: any) => {
    setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  };

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
          type="password"
          id="senha"
          placeholder="Senha"
          {...register("senha")}
          className={styles.input}
        />
        <input
          type="email"
          id="email"
          placeholder="E-mail"
          {...register("email")}
          className={styles.input}
        />
        <input
          type="text"
          id="telefone"
          placeholder="Telefone"
          {...register("telefone")}
          className={styles.input}
        />
        <Select
          options={options}
          className={styles.input}
          // Adicione o evento onChange
          onChange={handleSelectChange}
          placeholder="Modulo Default"
        />
        <div className={styles.inputWithContents}>
        <input
          type="text"
          id="img_url"
          placeholder="Imagem Url"
          {...register("img_url")}
          className={styles.input}
        />
          <CloudArrowUp />
        </div>
        <div className={styles.inputWithContents}>
          <div className={styles.input}>Ativo</div>
          <input
            type="checkbox"
            id="ativo"
            {...register("ativo")}
            className={styles.checkbox}
          />
        </div>
        <div className={styles.inputWithContents}>
          <div className={styles.input}>Administrador</div>
          <input
            type="checkbox"
            id="admin"
            {...register("admin")}
            className={styles.checkbox}
          />
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
