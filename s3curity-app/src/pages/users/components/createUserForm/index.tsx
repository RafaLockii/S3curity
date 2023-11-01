import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";

//Validação do formulário
const registerFormShceme = z.object({
  nome: z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase()),
  senha: z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'}),
  email: z.string().email( {message: 'E-mail inválido'}),
  telefone: z.string().refine((value) => {
    return /^\d+$/.test(value) && value.length >= 8;
  }, { message: 'Telefone inválido' }),
  modulo: z.number(),
  empresa_id: z.number(),
  img_url: z.string().refine((value) => {
    // Verifica se a img_url é uma URL válida (formato básico)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(value);
  }, { message: 'URL da imagem inválida' }),
  ativo: z.boolean(),
  admin: z.boolean(),
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

//Propriedades recebidas da rota
interface CreateUserformProps {
  empresa: string;
  empresaid: number;
  empresas: EmpresaData[];
}

type RegisterFormData = z.infer<typeof registerFormShceme>;

export default function CreateUserForm(empresa: CreateUserformProps) {

    // Propriedades do zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormShceme),
  });

 const showEmpresaSelect = empresa.empresa === 's3curity';

  console.log("Id da Empresa: " + empresa.empresaid)

  
  //Opções do select
  const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Gerencial" },
    { value: 3, label: "Estratégico" },
  ];
  console.log(options)

  const empresaOptions = empresa.empresas.map((empresaData) => ({
    value: empresaData.id,
    label: empresaData.nome,
  }));

  console.log(empresaOptions)
  console.log("EMPRESA DO PARAMETRO"+ empresa.empresaid)

  const {back} = useRouter();

  useEffect(() => {
    if (!showEmpresaSelect) {
      setValue('empresa_id', empresa.empresaid);
    }
  }, [showEmpresaSelect, empresa.empresaid]);
  
  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq")
    try{
      await api.post('user/create', {
        nome: data.nome,
        senha: data.senha,
        email: data.email,
        telefone: data.telefone,
        //Valores estáticos que precisam ser mudados
        usuario_criacao: "Criador",
        modulo_default: "default",
        //Fim dos valores estáticos
        acesso_admin: data.admin,
        cargo_id: data.modulo,
        empresa_id: data.empresa_id,
        imagem_perfil_url: data.img_url,
        // FALTA IMPLEMENTAR NO BACKEND A OPPÇÃO DE CRIAR COMO ATIVO OU INATIVO ativo: data.ativo,
      });
      back();
    }catch(e){
      console.log(e)
    }
  }

  // Função de manipulação para o evento onChange do Select
  const handleSelectChange = (selectedOption: any) => {
      setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  };
  const handleSelectChangeEmpresa = (selectedOption: any) => {
      setValue("empresa_id", selectedOption.value); // Atualiza o valor no registro
  };


  return (
    <div>
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
        {showEmpresaSelect && (
          <Select
          options={empresaOptions}
          className={styles.input}
          // Adicione o evento onChange
          onChange={handleSelectChangeEmpresa}
          placeholder="Empresa do usuário"
        />
        )}
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
        <button className={styles.createUserButton} type="submit">
            Salvar
        </button>
        
      </form>
      
    </div>
  );
}
