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
// import { useUserContext } from "@/context/UserContext";
import {MenuData } from "@/types/types";
import { TextField } from "@mui/material";

// Validação do formulário
const registerFormShceme = z.object({
  nome: z.string()
    .min(5, { message: 'O nome precisa ter ao menos 5 letras' })
    .regex(/^([a-záàâãéèêíïóôõöúçñ0-9\s]+)$/i, { message: "Nome inválido" })
    .transform((value) => value.trim().toLowerCase()),
  razao_s: z.string()
    .min(5, { message: 'A razão social precisa ter ao menos 5 letras' }),
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
  // const { user } = useUserContext();
  const [imagensCarrosel, setImagensCarrosel] = useState<string[]>([]);

  const { back } = useRouter();

  // Track the number of image inputs
  const [numImageInputs, setNumImageInputs] = useState(1);
  // const user = JSON.parse(window.localStorage.getItem('user') || '{}');
  const [user, setUser] = useState({
    nome: ''
  });

  useEffect(() => {
    setUser(JSON.parse(window.localStorage.getItem('user') || '{}'));
  },[])

  // Function to add more image inputs
  const addImageInput = () => {
    setNumImageInputs(numImageInputs + 1);
  };

  
  async function handleRegister(data: RegisterFormData) {
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
      back();
    } catch (e) {
    }
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleRegister)}>
        <TextField
          id="nome"
          label='Nome'
          {...register('nome')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.nome ? true : false}
          helperText={errors.nome ? errors.nome.message : ''}
        />
        <TextField
          id="razao_s"
          label='Razão Social'
          {...register('razao_s')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.razao_s ? true : false}
          helperText={errors.razao_s ? errors.razao_s.message : ''}
        />
        <TextField
          id="logo"
          label='Link da Logo'
          {...register('logo')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.logo ? true : false}
          helperText={errors.logo ? errors.logo.message : ''}
        />
        <TextField
          id="imagem_fundo"
          label='Link da Imagem de fundo'
          {...register('imagem_fundo')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.imagem_fundo ? true : false}
          helperText={errors.imagem_fundo ? errors.imagem_fundo.message : ''}
        />
        {/* Render image inputs dynamically */}
          {Array.from({ length: numImageInputs }).map((_, index) => (
          <TextField
          key={index}
          id="imagem_carrossel"
          label={`${index + 1}º Imagem do carrossel`}
          sx={{ m: 1, width: '27ch',  }}
          onChange={(e) => {
            const newImages = [...imagensCarrosel];
            newImages[index] = e.target.value;
            setImagensCarrosel(newImages);
          }}
        />
        ))}

        {/* Button to add more image inputs */}
        <button
          className={styles.addImage}
          type="button"
          onClick={addImageInput}
        >
          Imagem +
        </button>

        <button className={styles.createUserButton} type="submit">
          Salvar
        </button>
      </form>
   

    </div>
  );
}
