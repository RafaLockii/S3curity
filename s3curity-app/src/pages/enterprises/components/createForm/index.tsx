import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {MenuData } from "@/types/types";

// Validação do formulário
const registerFormShceme = z.object({
  nome: z.string()
    .min(5, { message: 'O nome precisa ter ao menos 5 letras' })
    .regex(/^([a-záàâãéèêíïóôõöúçñ0-9\s]+)$/i, { message: "Nome inválido" })
    .transform((value) => value.trim().toLowerCase()),
  razao_s: z.string()
    .min(5, { message: 'A razão social precisa ter ao menos 5 letras' })
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { message: "CNPJ inválido" })
    .transform((value) => value.replace(/\D/g, '')),
  logo: z.string().min(10,{message: 'A URL da logo precisa ter ao menos 10 caracteres'}),
  imagem_fundo: z.string().min(10,{message: 'A URL da imagem de fundo precisa ter ao menos 10 caracteres'}),
  // senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
});


type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateForm() {
  // Propriedades do zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormShceme),
  });

  // Pega informação do usuário logado
  const { user } = useUserContext();
  const [imagensCarrosel, setImagensCarrosel] = useState<string[]>([]);

  const { back } = useRouter();

  // Track the number of image inputs
  const [numImageInputs, setNumImageInputs] = useState(1);

  // Function to add more image inputs
  const addImageInput = () => {
    setNumImageInputs(numImageInputs + 1);
  };

  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq");
    try {
      const response =  await api.post("empresa/create", {
          nome: data.nome,
          razao_s: data.razao_s,
          logo: data.logo,
          imagem_fundo: data.imagem_fundo,
          usuario_criacao: user?.nome || "Usuário Não definido",
          carrosselImagens: imagensCarrosel,
        });
       // Assigning empresa_id to each menu in menuData
       console.log(response.data.empresa.id)
      back();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleRegister)}>
        <div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Nome"
            {...register("nome")}
          ></input>
          {errors.nome && (
            <div className={styles.formAnnotation}>
              {errors.nome ? errors.nome.message : ""}
            </div>
          )}
        </div>

        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="Razão Social formato: 00.000.000/0000-00"
            {...register("razao_s")}
          ></input>
          {errors.razao_s && (
            <div className={styles.formAnnotation}>
              {errors.razao_s ? errors.razao_s.message : ""}
            </div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="URL da Logo"
            {...register("logo")}
          ></input>
          {errors.logo && (
            <div className={styles.formAnnotation}>
              {errors.logo ? errors.logo.message : ""}
            </div>
          )}
        </div>
        <div className={styles.inputWithContents}>
          <input
            className={styles.input}
            placeholder="URL da Imagem de Fundo"
            {...register("imagem_fundo")}
          ></input>
          {errors.imagem_fundo && (
            <div className={styles.formAnnotation}>
              {errors.imagem_fundo ? errors.imagem_fundo.message : ""}
            </div>
          )}
        </div>
        {/* Render image inputs dynamically */}
        {Array.from({ length: numImageInputs }).map((_, index) => (
          <div key={index} className={styles.inputWithContents}>
            <input
              className={styles.input}
              placeholder={`Imagem do carrossel ${index + 1}`}
              onChange={(e) => {
                const newImages = [...imagensCarrosel];
                newImages[index] = e.target.value;
                setImagensCarrosel(newImages);
              }}
            ></input>
          </div>
        ))}

        {/* Button to add more image inputs */}
        <button
          className={styles.addImage}
          type="button"
          onClick={addImageInput}
        >
          Imagem +
        </button>
        </div>

        <button className={styles.createUserButton} type="submit">
          Salvar
        </button>
      </form>
   

    </div>
  );
}
