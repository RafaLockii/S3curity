import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useRouter } from "next/router";
import  api  from "@/lib/axios";
import { useEffect, useState } from "react";
import { EmpresaData } from "@/types/types";
import { TextField } from "@mui/material";

const registerFormShceme = z.object({
    nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s0-9]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
    razao_s: z.string().min(5,{message: 'A Razão social precisa ter ao menos 5 letras'}),
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

 //Bloco de imagens do carrossel ----------------------------------------------->
 const [imagensCarrosel, setImagensCarrosel] = useState<string[]>([]);
 const [numImageInputs, setNumImageInputs] = useState(1);
 // Function to add more image inputs
 const addImageInput = () => {
  setNumImageInputs(numImageInputs + 1);
};
// Fim do bloco de imagens do carrossel ---------------------------------------->


  const user = JSON.parse(window.localStorage.getItem("user") || '{}')
  //Bloco que popula na api
  async function handleRegister(data: RegisterFormData) {
    await api.put(`empresa/edit/${props.id}`, {
      "nome": data.nome,
      "razao_s": data.razao_s,
      "logo": data.logo,
      "imagem_fundo": data.imagem_fundo,
      "usuario_criacao": user?.email || "Não definido",
      "carrosselImagens": imagensCarrosel
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
    const carrosselNames: string[] = props.carrosseis.map((carrossel) => carrossel.nome);
  // Updating the state with the extracted names
  setImagensCarrosel((prev: string[]) => [...prev, ...carrosselNames]);
    setNumImageInputs(props.carrosseis.length)
    console.log(imagensCarrosel)
  }, [props]); 

  return (
    <div>

      <form onSubmit={handleSubmit(handleRegister)} className={styles.form}>
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
    sx={{ m: 1, width: '27ch',}}
    value={imagensCarrosel[index] || ''} // Populate with imagensCarrosel values
    defaultValue={imagensCarrosel[index] || ''} // Populate with imagensCarrosel values
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
