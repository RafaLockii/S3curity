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
import { CreateUserformProps} from "@/types/types";

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

type RegisterFormData = z.infer<typeof registerFormShceme>;

interface ModuloProps {
  id: number;
  nome: string;
}

interface MenuProps {
  id: number;
  nome: string;
  modulo: string;
}

interface ItemProps{
  id: number;
  nome: string;
  menus_id: number;
}

interface RelatorioProps{
  id: number;
  nome: string;
  relatorio: string;
  itens_id: number;
}

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
 const [draggableItens, setDraggableItens] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
 const [droppedItems, setDroppedItems] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
 const [modulosSelected, setModulosSelected] = useState<ModuloProps[]>([]);
 const [itensSelected, setItensSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);
 const [menusSelected, setMenusSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);
 const [relatoriosSelected, setRelatoriosSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);

function handleDragStart(e: React.DragEvent, itemType: MenuProps | ModuloProps | ItemProps) {
  e.dataTransfer.setData("itemType", JSON.stringify(itemType));
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer.getData("itemType")) as MenuProps | ModuloProps | ItemProps;
  setDroppedItems([...droppedItems, item]);
  if(!item.hasOwnProperty("modulo")){
    setModulosSelected([...modulosSelected, item]);
  }
  if(item.hasOwnProperty("modulo")){
    setMenusSelected([...menusSelected, item]);
  }
  if(item.hasOwnProperty("menus_id")){
    setItensSelected([...itensSelected, item]);
  }
  if(item.hasOwnProperty("itens_id")){
    setRelatoriosSelected([...relatoriosSelected, item]);
  }
  console.log(item)
  console.log(droppedItems);
}

function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
}

function handleRemoveItem(item: MenuProps | ModuloProps) {
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
        const response = await api.get(`menus_front`);
        console.log(response.data.menus)
        response.data.menus.map((item: any) => {
          setDraggableItens((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            modulo: item.modulo,
          }]);
        })

        const responseModulos = await api.get(`modulos`);
        responseModulos.data.modulos.map((item: any) => {
          setDraggableItens((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
          }]);
        })

        const responseItens = await api.get(`itens`);
        responseItens.data.itens.map((item: any) => {
          setDraggableItens((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            menus_id: item.menus_id,
          }]);
        })

        const responseRelatorios = await api.get(`relatorios`);
        responseRelatorios.data.relatorios.map((item: any) => {
          setDraggableItens((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            relatorio: item.relatorio,
            itens_id: item.itens_id,
          }]);
        })

  
      } catch(e){
        console.log(`Erro ao chamar a api: ${e}`);
      }
    }
    fetchData();
    console.log("DraggableItens");
    console.log(draggableItens);
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
        menus_ids: menusSelected.map((item) => item.id),
        itens_ids: itensSelected.map((item) => item.id),
        relatorios_ids: relatoriosSelected.map((item) => item.id),
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
      <div style={{display: "flex", flexDirection: "column"}}>
        {/* Bloco 01 --------------------------------------------> */}
        <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Modulos</h4>
            {draggableItens.map((item) => {
              if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
                return(
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => handleRemoveItem(item)}>
                    {item.nome}
                  </div>
                )
              }
            })}
              
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {droppedItems.length === 0 && <h4>Arraste os Modulos aqui</h4>}
            {droppedItems.map((item, index) => {
              if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
                return (
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => handleRemoveItem(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        {/* Fim do Bloco 01 -------------------------------------> */}

        {/* Bloco 02 --------------------------------------------> */}
        {droppedItems.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Menus</h4>
            {draggableItens.map((item) => {
              if(item.hasOwnProperty("modulo")){
                const modulo = modulosSelected.find(modulo => modulo.nome === (item as MenuProps).modulo);
                if (modulo) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={() => handleRemoveItem(item)}>
                      {item.nome}
                    </div>
                  )
                }
              }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {menusSelected.length === 0 && <h4>Arraste os Menus aqui</h4>}
            {droppedItems.map((item, index) => {
              if(item.hasOwnProperty("modulo")){
                return (
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => handleRemoveItem(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 02 -------------------------------------> */}

        {/* Bloco 03 --------------------------------------------> */}
        {menusSelected.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Itens</h4>
            {draggableItens.map((item) => {
              if(item.hasOwnProperty("menus_id")){
                const found = menusSelected.find(menu => menu.id === (item as ItemProps).menus_id);
                if (found) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={() => handleRemoveItem(item)}>
                      {item.nome}
                    </div>
                  )
                }
              }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {droppedItems.length === 0 && <h4>Arraste os itens aqui</h4>}
            {droppedItems.map((item, index) => {
              if(item.hasOwnProperty("menus_id")){
                return (
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => handleRemoveItem(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 03 -------------------------------------> */}
      </div>
      {/* Bloco 04 --------------------------------------------> */}
      {itensSelected.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Relatorios</h4>
            {draggableItens.map((item) => {
              if(item.hasOwnProperty("itens_id")){
                const found = itensSelected.find(itensArray => itensArray.id === (item as RelatorioProps).itens_id);
                if (found) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragEnd={() => handleRemoveItem(item)}>
                      {item.nome}
                    </div>
                  )
                }
              }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {relatoriosSelected.length === 0 && <h4>Arraste os itens aqui</h4>}
            {droppedItems.map((item, index) => {
              if(item.hasOwnProperty("itens_id")){
                return (
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={() => handleRemoveItem(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 04 -------------------------------------> */}
    </div>
  );
}
