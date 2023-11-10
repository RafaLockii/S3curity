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

//Validação do formulário
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


interface EmpresaData {
  id: number;
  nome: string;
  cnpj: string;
  logo: string;
  data_alt: any;
  data_criacao: string;
  imagem_fundo: string;
  usuario_criacao: string;
  usuario_cad_alt: any;
}

// {
//   "nome": "Nome da Empresa 103",
//   "razao_s": "Razão Social da Empresa",
//   "logo": "url_do_logo",
//   "imagem_fundo": "url_da_imagem_de_fundo",
//   "usuario_criacao": "Nome do Usuário",
//   "carrosselImagens": [
//       "url_da_imagem_1",
//       "url_da_imagem_2",
//       "url_da_imagem_3",
//       "url_da_imagem_4",
//       "url_da_imagem_5"
//   ]
// }

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

 //pega informação do usuário logado
 const {user} = useUserContext();

//Fim do bloco de itens arrastáveis ------------------------------------->


  
  //Opções do select
  const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Gerencial" },
    { value: 3, label: "Estratégico" },
  ];

  const {back} = useRouter();

  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq")
    try{
      await api.post('empresa/create', {
        nome: data.nome,
        razao_s: data.razao_s,
        logo: data.logo,
        imagem_fundo: data.imagem_fundo,
        usuario_criacao: user?.nome || 'Usuário Não definido',
        carrosselImagens: [
          "url_da_imagem_1",
          "url_da_imagem_2",
          "url_da_imagem_3",
        ]
      });
      back();
    }catch(e){
      console.log(e)
    }
  }

  // Função de manipulação para o evento onChange do Select
  // const handleSelectChange = (selectedOption: any) => {
  //     setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  // };

  return (
    <div className={styles.formContainer}>
      <form  className={styles.form} onSubmit={handleSubmit(handleRegister)}>
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
            className={styles.input}
            placeholder="Razão Social formato: 00.000.000/0000-00"
            {...register("razao_s")}
            ></input>
            {errors.razao_s &&(

                <div className={styles.formAnnotation}>
                {errors.razao_s ? errors.razao_s.message : ''}
            </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            className={styles.input}
            placeholder="URL da Logo"
            {...register("logo")}
            ></input>
            {errors.logo &&(
                
                  <div className={styles.formAnnotation}>
                  {errors.logo ? errors.logo.message : ''}
              </div>
            )}
        </div>
        <div className={styles.inputWithContents}>
            <input
            className={styles.input}
            placeholder="URL da Imagem de Fundo"
            {...register("imagem_fundo")}
            ></input>
            {errors.imagem_fundo &&(
                <div className={styles.formAnnotation}>
                {errors.imagem_fundo ? errors.imagem_fundo.message : ''}
            </div>
            )}
        </div>
        
        {/* <Select
          options={options}
          className={styles.input}
          // Adicione o evento onChange
          onChange={handleSelectChange}
          placeholder="Modulo Default"
        /> */}
        <button className={styles.createUserButton} type="submit">
            Salvar
        </button>
        
      </form>
    </div>
  );
}
