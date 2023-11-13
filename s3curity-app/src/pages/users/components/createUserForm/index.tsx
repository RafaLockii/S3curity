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

interface draggableItensProps{
  label: string;
  type: string;
}
interface MenuProps{
  id: number;
  nome: string;
  itens: string[];
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
 //pega informação do usuário logado
 const {user} = useUserContext();


//Bloco de itens arrastáveis ------------------------------------->
 const [draggableItens, setDraggableItens] = useState<MenuProps[]>([
//   {
//     label: "Contas",
//     type: "Menu",
//  },
//   {
//     label: "Conta 01",
//     type: "Item",
//  }
]);

const [droppedItems, setDroppedItems] = useState<MenuProps[]>([]);

function handleDragStart(e: React.DragEvent, itemType: MenuProps) {
  e.dataTransfer.setData("itemType", JSON.stringify(itemType));
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer.getData("itemType")) as MenuProps;
  setDroppedItems([...droppedItems, item]);
  console.log(item)
  console.log(droppedItems);
}

function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
}

function handleRemoveItem(item: MenuProps) {
  const updatedDroppedItems = droppedItems.filter((i) => i !== item);
  setDroppedItems(updatedDroppedItems);
}

//Fim do bloco de itens arrastáveis ------------------------------------->


  
  //Opções do select
  const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Gerencial" },
    { value: 3, label: "Estratégico" },
  ];

  const empresaOptions = empresa.empresas.map((empresaData) => ({
    value: empresaData.id,
    label: empresaData.nome,
  }));


  const {back} = useRouter();
  console.log("Id da empresa :" + empresa.empresaid)

  useEffect(() => {
    if (!showEmpresaSelect) {
      setValue('empresa_id', empresa.empresaid);
    }
    const fetchData = async () => {
      console.log("Entrou no fetch data")
      try{
        const response = await api.get(`menu/${empresa.empresaid}/1`);
        response.data.map((item: any) => {
          setDraggableItens((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            itens: item.itens.map((item: any) => item.nome)
          }]);
        })

  
      } catch(e){
        console.log(`Erro ao chamar a api: ${e}`);
      }
    }
    fetchData();

  }, []);
  
  //Dentro do array do useeffect tinha sses itens : showEmpresaSelect, empresa.empresaid
  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq")
    try{
      await api.post('user/create', {
        nome: data.nome,
        senha: data.senha,
        email: data.email,
        telefone: data.telefone,
        usuario_criacao: user?.email || "Não idnetificado",
        modulo_default: "default",
        acesso_admin: data.admin,
        cargo_id: data.modulo,
        empresa_id: data.empresa_id,
        imagem_perfil_url: data.img_url,
        menus_ids: droppedItems.map((item) => item.id)
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

      <div className={styles.draggableBoxOutput}>
        <h4>Escolha Suas opções</h4>
        {draggableItens.map((item) => (
          <div
            key={item.id}
            className={styles.draggableItens}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
          >
            <div>{item.nome}</div>
            <div>{item.itens.map((item)=>{
              return(
                <div>{item}</div>
              )
            })}</div>
          </div>
        ))}
      </div>
      
      <div
        className={styles.draggableBoxInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {droppedItems.length === 0 && <h4>Arraste os itens aqui</h4>}
        {droppedItems.map((item, index) => (
          <div 
          key={item.id}
          className={styles.draggableItens}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={() => handleRemoveItem(item)}>
            <div>{item.nome}</div>
            <div>{item.itens.map((item)=>{
              return(
                <div>{item}</div>
              )
            })}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
