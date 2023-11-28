import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import Image from "next/image";
import { ArrowLeft, Check, CloudArrowUp } from "phosphor-react";
import Select from "react-select";
import { useRouter } from "next/router";
import  api  from "@/lib/axios";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { CreateUserformProps} from "@/types/types";
import { Checkbox, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { ContactlessOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { TableData } from "@/types/types";

//Validação do formulário
const registerFormShceme = z.object({
  nome: z.optional(z.string().min(5,{message: 'O nome precisa ter ao menos 5 letras'}).regex(/^([a-záàâãéèêíïóôõöúçñ\s]+)$/i, {message:"Nome inválido"}).transform((value) => value.trim().toLowerCase())),
  senha: z.optional(z.string().min(8, {message: 'A senha precisa ter ao menos 8 caracteres'})),
  email: z.optional(z.string().email( {message: 'E-mail inválido'})),
  telefone: z.optional(z.string().refine((value) => {
    return /^\d+$/.test(value) && value.length >= 8;
  }, { message: 'Telefone inválido' })),
  modulo: z.optional(z.number()),
  empresa_id: z.optional(z.number()),
  img_url: z.optional(z.string().refine((value) => {
    // Verifica se a img_url é uma URL válida (formato básico)
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(value);
  }, { message: 'URL da imagem inválida' })),
  // ativo: z.optional(z.boolean()),
  admin: z.optional(z.boolean()),
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
  } = useForm<RegisterFormData>()
  // {
  //   resolver: zodResolver(registerFormShceme),
  // }

 const showEmpresaSelect = empresa.empresa === 's3curity';
 //pega informação do usuário logado
 const {user} = useUserContext();

 const storedUser = JSON.parse(window.sessionStorage.getItem('selectedUser') || 'null');

 console.log("USUÁRIO ARMAZENADO")
 console.log(storedUser);


//Bloco de itens arrastáveis ------------------------------------->
 const [draggableItens, setDraggableItens] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
 const [droppedItems, setDroppedItems] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
 const [modulosSelected, setModulosSelected] = useState<ModuloProps[]>([]);
 const [itensSelected, setItensSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);
 const [menusSelected, setMenusSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);
 const [relatoriosSelected, setRelatoriosSelected] = useState<ItemProps[] | ModuloProps[] | MenuProps[] | RelatorioProps[]>([]);
 const [showPassword, setShowPassword] = useState(false);
 const[laodingRequest, setLoadingRequest] = useState(false);
 const[defaultValuesLoaded, setDefaultValuesLoaded] = useState(false);
  // Crie um estado para o carregamento da requisição [loadingRequest]

 const handleClickShowPassword = () => setShowPassword((show) => !show);   

 const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
     event.preventDefault();
 };   

function handleDragStart(e: React.DragEvent, itemType: MenuProps | ModuloProps | ItemProps) {
  e.dataTransfer.setData("itemType", JSON.stringify(itemType));
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer.getData("itemType")) as MenuProps | ModuloProps | ItemProps | RelatorioProps;
  setDroppedItems([...droppedItems, item]);
  if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
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
  
  //-------------------------------------------------------->
}

// const updatedDraggableItems = draggableItens.filter(
//   (item) => !modulosSelected.find((data) => data.id === item.id)
// );
// setDraggableItens(updatedDraggableItems);

function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
}

function handleRemoveItem(item: MenuProps | ModuloProps | ItemProps | RelatorioProps) {
  // const updatedDroppedItems = droppedItems.filter((i) => i !== item);
  // setDroppedItems(updatedDroppedItems);
  const updatedDraggableItens = draggableItens.filter((i)=>i !== item);
  setDraggableItens(updatedDraggableItens);
  // setDraggableItens((prev)=>[...prev, item])
}
function handleRemoveItemFromOutputBox(item: MenuProps | ModuloProps | ItemProps | RelatorioProps) {
  const updatedDroppedItems = droppedItems.filter((i) => i !== item);
  setDroppedItems(updatedDroppedItems);
  setDraggableItens((prev)=>[...prev, item])

  if(!item.hasOwnProperty("modulo")){
    const updatedItems = modulosSelected.filter((i) => i !== item);
    setModulosSelected(updatedItems);
  }
  if(item.hasOwnProperty("modulo")){
    const updatedItems = menusSelected.filter((i) => i !== item);
    setMenusSelected(updatedItems);
  }
  if(item.hasOwnProperty("menus_id")){
    const updatedItems = itensSelected.filter((i) => i !== item);
    setItensSelected(updatedItems);
  }
  if(item.hasOwnProperty("itens_id")){
    const updatedItems = relatoriosSelected.filter((i) => i !== item);
    setRelatoriosSelected(updatedItems);
  }
}

//Fim do bloco de itens arrastáveis ------------------------------------->


  const[isAdmin, setIsAdmin] = useState(false);

  //Opções do select
  const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Estratégico" },
    { value: 3, label: "Gerencial" },
  ];

  const empresaOptions = empresa.empresas.map((empresaData) => ({
    value: empresaData.id,
    label: empresaData.nome,
  }));


  const {back} = useRouter();
  const fetchDefaultValues = () => {
    if (storedUser) {
      try {
        const updatedDraggableItems = draggableItens.filter(
          (item) => !modulosSelected.find((data) => data.id === item.id)
        );
        setDraggableItens(updatedDraggableItems);
      } catch (e) {
        console.log(e);
      }
    }
    setDefaultValuesLoaded(true);
  };

  useEffect(() => {
    if (!showEmpresaSelect) {
      setValue('empresa_id', empresa.empresaid);
    }
    const fetchData = async () => {
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
        if(storedUser){
            try{
            const response = await api.get(`data/user/${storedUser.id}`);
            response.data.modulos.map((data: ModuloProps)=>{
              setDroppedItems((prev)=> [...prev, data])
              setModulosSelected((prev)=>[...prev, data])
            });
            response.data.menus.map((data: MenuProps)=>{
              setDroppedItems((prev)=> [...prev, data])
              setMenusSelected((prev)=>[...prev, data])
            });
            response.data.itens.map((data: ItemProps)=>{
              setDroppedItems((prev)=> [...prev, data])
              setItensSelected((prev)=>[...prev, data])
            });
            response.data.relatorios.map((data: RelatorioProps)=>{
              setDroppedItems((prev)=> [...prev, data])
              setRelatoriosSelected((prev)=>[...prev, data])
            });
          }catch(e){
            console.log(e)
          }
          }
        
  
      } catch(e){
        console.log(`Erro ao chamar a api: ${e}`);
      }
      setLoadingRequest(true);
    }
    fetchData();
  }, []);

  useEffect(()=>{
    fetchDefaultValues();
  }, [laodingRequest])


  

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
        modulo_default: data.modulo,
        acesso_admin: data.admin,
        // acesso_admin: isAdmin,
        cargo_id: data.modulo,
        empresa_id: data.empresa_id,
        imagem_perfil_url: data.img_url,
        menus_ids: menusSelected.map((item) => item.id),
        itens_ids: itensSelected.map((item) => item.id),
        relatorios_ids: relatoriosSelected.map((item) => item.id),
        modulos_ids: modulosSelected.map((item) => item.id),
      });
      back();
    }catch(e){
      console.log(e)
    }
  }

  // Função de manipulação para o evento onChange do Select
  const handleSelectChange = (selectedOption: any) => {
    console.log(selectedOption.value);
      setValue("modulo", selectedOption.value); // Atualiza o valor no registro
  };
  const handleSelectChangeEmpresa = (selectedOption: any) => {
    console.log(selectedOption.value);
      setValue("empresa_id", selectedOption.value); // Atualiza o valor no registro
  };


  return (
    <>
    {defaultValuesLoaded && (
    <div className={styles.formContainer}>
      <form  className={styles.form} onSubmit={handleSubmit(handleRegister)}>
       
        <TextField
          id="nome"
          label="Nome"
          variant="outlined"
          {...register('nome')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.nome ? true : false}
          helperText={errors.nome ? errors.nome.message : ''}
        />
        
        <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined">
          <InputLabel htmlFor="senha">Senha</InputLabel>
          <OutlinedInput
              id="senha"
              type={showPassword ? 'text' : 'password'}
              error={errors.senha ? true : false}
              endAdornment={
              <InputAdornment position="end">
                  <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
              </InputAdornment>
              }
              label="Senha"
              {...register('senha')}
          />
        </FormControl>
        <TextField
          id="email"
          label="E-mail"
          variant="outlined"
          {...register('email')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.email ? true : false}
          helperText={errors.email ? errors.email.message : ''}
        />

        <TextField
          id="telefone"
          label="Telefone"
          variant="outlined"
          {...register('telefone')}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.telefone ? true : false}
          helperText={errors.telefone ? errors.telefone.message : ''}
        />

        <TextField
          id="img_url"
          placeholder="Imagem Url"
          {...register("img_url")}
          sx={{ m: 1, width: '27ch',  }}
          error={errors.img_url ? true : false}
          helperText={errors.img_url ? errors.img_url.message : ''}
        />
        
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
            onChange={handleSelectChangeEmpresa}
            placeholder="Empresa do usuário"
            defaultValue={storedUser != null ? (empresaOptions.find(empresa => empresa.value === storedUser.funcionario.empresa_id)) : null}
          />
        )}
        {/* <FormControlLabel
          value="start"
          control={<Checkbox id="ativo" {...register("ativo")} checked={storedUser != null ? (storedUser.funcionario.ativo) : false}/>}
          label="Ativo"
          sx={{ m: 1, width: '27ch', justifyContent: "space-between" }}
          labelPlacement="start"
        /> */}
        <FormControlLabel
          value={storedUser != null ?  (storedUser.funcionario.acesso_admin) : isAdmin}
          control={<Checkbox id="admin" checked={storedUser != null ?  (storedUser.funcionario.acesso_admin) : isAdmin} onChange={(e) =>{

            setIsAdmin(e.target.checked);
            setValue("admin", e.target.checked);
          }} />}
          label="Administrador"
          sx={{ m: 1, width: '27ch', justifyContent: "space-between" }}
          labelPlacement="start"
        />
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
                  onDragEnd={() => handleRemoveItemFromOutputBox(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        {/* Fim do Bloco 01 -------------------------------------> */}

        {/* Bloco 02 --------------------------------------------> */}
        {modulosSelected.length > 0 && (
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
                  onDragEnd={() => handleRemoveItemFromOutputBox(item)}>
                    <div>{item.nome}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 02 -------------------------------------> */}
        {/* menusSelected.length > 0 */}
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
                  onDragEnd={() => handleRemoveItemFromOutputBox(item)}>
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
                  onDragEnd={() => handleRemoveItemFromOutputBox(item)}>
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
    )}
    </>
  );
}
