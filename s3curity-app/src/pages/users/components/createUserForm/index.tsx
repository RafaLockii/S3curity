import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";

const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
  email: z.string().email( {message: 'E-mail inválido'}),
  telefone: z.string().refine((value) => {
    return /^\d+$/.test(value) && value.length >= 8;
  }, { message: 'Telefone inválido' }),
  modulo: z.string(),
  img_url: z.string().refine((value) => {
    // Verifica se a img_url é uma URL válida (formato básico)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(value);
  }, { message: 'URL da imagem inválida' }),
  ativo: z.boolean(),
  admin: z.boolean(),
});

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormShceme),
  });

  const options = [
    { value: "operacional", label: "Operacional" },
    { value: "gerencial", label: "Gerencial" },
    { value: "estratégico", label: "Estratégico" },
  ];

  const router = useRouter();

  async function handleRegister(data: RegisterFormData) {
    await console.log(data);
  }

  // Função de manipulação para o evento onChange do Select
  const handleSelectChange = (selectedOption: any) => {
    setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  };

  // async function handleSaveButtonRouter(){
  //   await router.push('/users')
  // }
  return (
    <div>
      <form  className={styles.form}>
        <div className={styles.inputWithContents}>
            <input
            className={styles.input}
            placeholder="Nome"
            {...register("nome")}
            ></input>
            {errors.nome &&(
                <div className={styles.formAnnotation}>
                {errors.nome ? errors.nome.message : ''}
            </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            type="password"
            id="senha"
            placeholder="Senha"
            {...register("senha")}
            className={styles.input}
            />
            {errors.senha &&(
                <div className={styles.formAnnotation}>
                {errors.senha ? errors.senha.message : ''}
            </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            type="email"
            id="email"
            placeholder="E-mail"
            {...register("email")}
            className={styles.input}
            />
            {errors.email &&(
                <div className={styles.formAnnotation}>
                {errors.email ? errors.email.message : ''}
            </div>
            )}
        </div>
        <div className={styles.inputWithContents}>

            <input
            type="text"
            id="telefone"
            placeholder="Telefone"
            {...register("telefone")}
            className={styles.input}
            />
            {errors.telefone &&(
                <div className={styles.formAnnotation}>
                {errors.telefone ? errors.telefone.message : ''}
            </div>
            )}
        </div>
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
          {errors.img_url &&(
                <div className={styles.formAnnotation}>
                {errors.img_url ? errors.img_url.message : ''}
            </div>
            )}
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
        <button className={styles.createUserButton} onClick={(e) => {
  e.preventDefault(); // Impede o comportamento padrão do botão
  handleSubmit(handleRegister)(); // Chame a função de envio do formulário
}}>
            Salvar
        </button>
        
      </form>
      
    </div>
  );
}
