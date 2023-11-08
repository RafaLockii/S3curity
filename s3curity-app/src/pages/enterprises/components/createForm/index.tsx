import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./styles.module.css";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { api } from "@/lib/axios";
import { useUserContext } from "@/context/UserContext";
import Select from "react-select";
import { useState } from "react";


const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s0-9]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  razao_social: z.string().refine((value) => {
    const numericValue = value.replace(/\D/g, '');
    return numericValue.length === 14;
  }, { message: 'CNPJ inválido' }),
  logo: z.string().min(1, {message: 'Preencha o campo'}),
  background_img: z.string().min(1, {message: 'Preencha o campo'}),
  modulo: z.string().min(1, {message: 'Preencha o campo'}),
  menu: z.string().min(1, {message: 'Preencha o campo'}),
  item: z.string().min(1, {message: 'Preencha o campo'}),
  relatorio: z.string().min(1, {message: 'Preencha o campo'}),
  // data_criacao: z.string().min(1, {message: 'Preencha o campo'}),
  // usuario_criacao: z.string().min(1, {message: 'Preencha o campo'}),
  // data_alteracao: z.string().min(1, {message: 'Preencha o campo'}),
  // usuario_alteracao: z.string().min(1, {message: 'Preencha o campo'}),
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

  const{user} = useUserContext();

  const [menus, setMenus] = useState(['']); // Initialize with one menu input
  const [itens, setItens] = useState(['']);
  const [relatorios, setRelatorios] = useState(['']);

  const addInput = (type: string) => {
    if(type === 'menu'){
      setMenus([...menus, '']); // Add another menu input
    };
    if(type === 'item'){
      setItens([...itens, '']); // Add another item input
    };
    if(type === 'relatorio'){
      setRelatorios([...relatorios, '']); // Add another relatorio input
    };
  };


   //Opções do select
   const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Gerencial" },
    { value: 3, label: "Estratégico" },
  ];


  const handleSelectChange = (selectedOption: any) => {
    setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  };

  const {back} = useRouter();

  async function handleRegister(data: RegisterFormData) {
    try{
      await api.post('empresa/create',{
        // id: Math.floor(Math.random() * (100 - 1) + 1),
        nome: data.nome,
        razao_s: data.razao_social,
        logo: data.logo,
        // data_alt: null,
        imagem_fundo: data.background_img,
        usuario_criacao: user?.email || "Não definido",
        // data_criacao: "2023-10-28T00:00:00.000Z",
        // usuario_cad_alt: null,
      })
      await back();
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className={styles.formContainer}>
      
      <form className={styles.form}>
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
            placeholder="Imagem Carrosel"
            {...register("background_img")}
            className={styles.input}
          />
            <CloudArrowUp />
          {errors.background_img && (
            <div className={styles.formAnnotation}>{errors.background_img.message}</div>
          )}
        </div>
        <div className={styles.inputWithContents}>
        <Select
          options={options}
          className={styles.input}
          // Adicione o evento onChange
          onChange={handleSelectChange}
          placeholder="Modulo Default"
        />
          {errors.background_img && (
            <div className={styles.formAnnotation}>{errors.background_img.message}</div>
          )}
        </div>
        {menus.map((menu, index) => (
          <div className={styles.inputWithContents}>
            <input
              type="text"
              id="menu"
              placeholder="Menu"
              {...register("menu")}
              className={styles.input}
            />
            {errors.background_img && (
              <div className={styles.formAnnotation}>{errors.background_img.message}</div>
            )}
          </div>
        ))}
        {/* <button
          className={styles.addButton}
          type="button"
          onClick={() => addInput('menu')}
        >
          Adicionar +
        </button> */}
        
        {itens.map((item, index) => (
          <div className={styles.inputWithContents}>
            <input
              type="text"
              id="item"
              placeholder="Itens"
              {...register("item")}
              className={styles.input}
            />
            {errors.background_img && (
              <div className={styles.formAnnotation}>{errors.background_img.message}</div>
            )}
          </div>
        ))}
        {/* <button
          className={styles.addButton}
          type="button"
          onClick={() => addInput('item')}
        >
          Adicionar +
        </button> */}

        {relatorios.map((relatorio, index) => (
          <div className={styles.inputWithContents}>
            <input
              type="text"
              id="relatorio"
              placeholder="Relatórios"
              {...register("relatorio")}
              className={styles.input}
            />
            {errors.background_img && (
              <div className={styles.formAnnotation}>{errors.background_img.message}</div>
            )}
          </div>
        ))}

        {/* <button
          className={styles.addButton}
          type="button"
          onClick={() => addInput('relatorio')}
        >
          Adicionar +
        </button> */}
        
        <button
        className={styles.createUserButton}
        type="submit"
        onClick={(e)=>{
          e.preventDefault();
          handleSubmit(handleRegister)();
        }}
      >
        Salvar
      </button>
      </form>

    </div>
  );
}
