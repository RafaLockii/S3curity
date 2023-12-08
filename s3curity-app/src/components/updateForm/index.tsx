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
// import { useUserContext } from "@/context/UserContext";
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

interface empresaOptions{
  value: number;
  label: string;
}

export default function UpdateForm() {

    // Propriedades do zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>()


 const storedUser = JSON.parse(window.sessionStorage.getItem('editedUser') || 'null');

 console.log("USUÁRIO ARMAZENADO")
 console.log(storedUser);


//Bloco de itens arrastáveis ------------------------------------->
//  const [draggableItens, setDraggableItens] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
//  const [droppedItems, setDroppedItems] = useState<MenuProps[] | ModuloProps[] | ItemProps[] | RelatorioProps[]>([]);
 const [draggableModulos, setDraggableModulos] = useState<ModuloProps[]>([]);
 const [draggableMenus, setDraggableMenus] = useState<MenuProps[]>([]);
 const [draggableItens, setDraggableItens] = useState<ItemProps[]>([]);
 const [draggableRelatorios, setDraggableRelatorios] = useState<RelatorioProps[]>([]);

 const [modulosSelected, setModulosSelected] = useState<ModuloProps[]>([]);
 const [itensSelected, setItensSelected] = useState<ItemProps[]>([]);
 const [menusSelected, setMenusSelected] = useState<MenuProps[]>([]);
 const [relatoriosSelected, setRelatoriosSelected] = useState<RelatorioProps[]>([]);
 const [showPassword, setShowPassword] = useState(false);
 const[laodingRequest, setLoadingRequest] = useState(false);
 const[defaultValuesLoaded, setDefaultValuesLoaded] = useState(false);

 const [empresaOptions, setEmpresaOptions] = useState<empresaOptions[]>([]);

  // Crie um estado para o carregamento da requisição [loadingRequest]

 const handleClickShowPassword = () => setShowPassword((show) => !show);   

 const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
     event.preventDefault();
 };   

function handleDragStart(e: React.DragEvent, itemType: MenuProps | ModuloProps | ItemProps | RelatorioProps) {
  e.dataTransfer.setData("itemType", JSON.stringify(itemType));
}

function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  const item = JSON.parse(e.dataTransfer.getData("itemType")) as MenuProps | ModuloProps | ItemProps | RelatorioProps;

  if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
    const updatedDraggableModulo = draggableModulos.filter((modulos) => modulos.id !== item.id);
    setDraggableModulos(updatedDraggableModulo);
    setModulosSelected(prev => [...prev, item as ModuloProps]);
  }
  if(item.hasOwnProperty("modulo")){
    const updatedDraggableMenus = draggableMenus.filter((menus) => menus.id !== (item as MenuProps).id)
    setDraggableMenus(updatedDraggableMenus);
    setMenusSelected(prev => [...prev, item as MenuProps]);
  }
  if(item.hasOwnProperty("menus_id")){
    const updatedDraggableItens = draggableItens.filter((itens)=> itens.id != (item as ItemProps).id);
    setDraggableItens(updatedDraggableItens);
    setItensSelected(prev => [...prev, item as ItemProps]);
  }
  if(item.hasOwnProperty("itens_id")){
    const updatedDraggableRelatorios = draggableRelatorios.filter((relatorios)=> relatorios.id !== (item as RelatorioProps).id);
    setDraggableRelatorios(updatedDraggableRelatorios);
    setRelatoriosSelected(prev => [...prev, item as RelatorioProps]);
  }
}


function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
}

function handleRemoveItemFromOutputBox(item: MenuProps | ModuloProps | ItemProps | RelatorioProps) {
  
  if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
    const updatedModulosSelected = modulosSelected.filter((selectedModulos)=> selectedModulos.id !== (item as ModuloProps).id);
    setModulosSelected(updatedModulosSelected);
    setDraggableModulos((prev) => [...prev, item as ModuloProps]);

    const updatedMenusSelected = menusSelected.filter(selectedMenus => selectedMenus.modulo !== (item as ModuloProps).nome);
    setMenusSelected(updatedMenusSelected);
    setDraggableMenus((prevMenus) => [...prevMenus, ...menusSelected.filter(selectedMenus => selectedMenus.modulo === (item as ModuloProps).nome)]);

    setDraggableItens((prev)=> [...prev, ...itensSelected]);
    setItensSelected([]);

    setDraggableRelatorios((prev) => [...prev, ...relatoriosSelected]);
    setRelatoriosSelected([]);
  }
  if(item.hasOwnProperty("modulo")){
    const updatedMenusSelected = menusSelected.filter((selectedMenus)=> selectedMenus.id !== (item as MenuProps).id);
    setMenusSelected(updatedMenusSelected);
    setDraggableMenus((prev) => [...prev, item as MenuProps]);

    setDraggableItens((prev)=> [...prev, ...itensSelected]);
    setItensSelected([]);


    setDraggableRelatorios((prev)=> [...prev, ...relatoriosSelected]);
    setRelatoriosSelected([]);
  }
  if(item.hasOwnProperty("menus_id")){
    const updatedItensSelected = itensSelected.filter((selectedItens)=> selectedItens.id !== (item as ItemProps).id);
    setItensSelected(updatedItensSelected);
    setDraggableItens((prev) => [...prev, item as ItemProps]);
    // setItensSelected(prev => prev.filter(i => i.id !== item.id));
    setDraggableRelatorios((prev)=> [...prev, ...relatoriosSelected]);
    setRelatoriosSelected([]);
    
  if(item.hasOwnProperty("itens_id")){
    const updateRelatoriosSelected = relatoriosSelected.filter((selectedRelatorios)=> selectedRelatorios.id !== (item as RelatorioProps).id);

    setRelatoriosSelected(updateRelatoriosSelected);
    setDraggableRelatorios((prev) => [...prev, item as RelatorioProps]);
    // setDraggableMenus((prev) => [...prev, item as MenuProps]);
    // setRelatoriosSelected(prev => prev.filter(i => i.id !== item.id));
  }
}
}
//Fim do bloco ------------------------------------------------------>

//Fim do bloco de itens arrastáveis ------------------------------------->


  const[isAdmin, setIsAdmin] = useState(false);

  //Opções do select
  const options = [
    { value: 1, label: "Operacional" },
    { value: 2, label: "Estratégico" },
    { value: 3, label: "Gerencial" },
  ];

  const {back} = useRouter();

  const fetchDefaultValues = () => {
    if (storedUser) {
      try {
        const updatedDraggableItems = draggableItens.filter((draggableItem) => {
          const newValue = !itensSelected.some((droppedItem) => droppedItem.id === draggableItem.id);
          console.log("Valor Item: ");
          return newValue;
        });

        const updatedDraggableModulos = draggableModulos.filter((draggableModulos) => {
          const newValue = !modulosSelected.some((selectedModulos) => selectedModulos.id === draggableModulos.id);
          return newValue;
        })

        const updatedDraggableMenus = draggableMenus.filter((draggableMenus)=>{
          const newValue = !menusSelected.some((selectedMenus) => selectedMenus.id === draggableMenus.id);
          return newValue;
        })

        const updatedDraggableRelatorios = draggableRelatorios.filter((draggableRelatorios) => {
          const newValue = !relatoriosSelected.some((selectedRelatorio) => selectedRelatorio.id === draggableRelatorios.id);
        })
        setDraggableItens(updatedDraggableItems);
        setDraggableMenus(updatedDraggableMenus);
        setDraggableModulos(updatedDraggableModulos);
        setDraggableRelatorios(updatedDraggableRelatorios);
        setValue('nome', storedUser.nome);
        setValue('email', storedUser.email);
        setValue('telefone', storedUser.telefone);
        setValue('img_url', storedUser.funcionario.imagem.url);
        setValue('empresa_id', storedUser.funcionario.empresa_id);
        
      } catch (e) {
        console.log(e);
      }
    }
    setDefaultValuesLoaded(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try{
        const responselistaempresas = await api.get('empresas');
        responselistaempresas.data.map((item: any) =>{
          setEmpresaOptions((prev) => [...prev, {
            value: item.id,
            label: item.nome,
          }])
        })



        const response = await api.get(`menus_front`);
        console.log(response.data.menus)
        response.data.menus.map((item: any) => {
          setDraggableMenus((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            modulo: item.modulo,
          }]);
        })

        const responseModulos = await api.get(`modulos`);
        responseModulos.data.modulos.map((item: any) => {
          setDraggableModulos((prev) => [...prev, {
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
          setDraggableRelatorios((prev) => [...prev, {
            id: item.id,
            nome: item.nome,
            relatorio: item.relatorio,
            itens_id: item.itens_id,
          }]);
        })
        if(storedUser){
            try{
            setIsAdmin(storedUser.funcionario.acesso_admin)
            const response = await api.get(`data/user/${storedUser.id}`);
            response.data.modulos.map((data: ModuloProps)=>{
              setModulosSelected((prev)=>[...prev, data])
            });
            response.data.menus.map((data: MenuProps)=>{
              setMenusSelected((prev)=>[...prev, data])
            });
            response.data.itens.map((data: ItemProps)=>{
              setItensSelected((prev)=>[...prev, data])
            });
            response.data.relatorios.map((data: RelatorioProps)=>{
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


    const user = JSON.parse(localStorage.getItem('user') || '{}');
  

  //Dentro do array do useeffect tinha sses itens : showEmpresaSelect, empresa.empresaid
  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq")
    try{
      data.senha !== "" ?
      await api.put(`user/edit/${storedUser.id}`, {
        nome: data.nome,
        senha: data.senha,
        email: data.email,
        telefone: data.telefone,
        usuario_criacao: user?.email || "Não identificado",
        modulo_default: data.modulo,
        acesso_admin: data.admin,
        // acesso_admin: isAdmin,
        cargo_id: data.modulo,
        imagem_perfil_url: data.img_url,
        menus_ids: menusSelected.map((item) => item.id),
        itens_ids: itensSelected.map((item) => item.id),
        relatorios_ids: relatoriosSelected.map((item) => item.id),
        modulos_id: modulosSelected.map((item) => item.id),
        empresa_id: data.empresa_id
      })
      :
      await api.put(`user/edit/${storedUser.id}`, {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        usuario_criacao: user?.email || "Não identificado",
        modulo_default: data.modulo,
        acesso_admin: data.admin,
        // acesso_admin: isAdmin,
        cargo_id: data.modulo,
        imagem_perfil_url: data.img_url,
        menus_ids: menusSelected.map((item) => item.id),
        itens_ids: itensSelected.map((item) => item.id),
        relatorios_ids: relatoriosSelected.map((item) => item.id),
        modulos_id: modulosSelected.map((item) => item.id),
        empresa_id: data.empresa_id
      });
      back();
    }catch(e){
      console.log(e)
    }
  }

  // Função de manipulação para o evento onChange do Select
  const handleSelectChange = (selectedOption: any, isEmpresa: boolean) => {
    if(isEmpresa){
      setValue("empresa_id", selectedOption.value);
    } else {
    setValue("modulo", selectedOption.value); // Atualiza o valor no registro

    }
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
        
        <FormControl sx={{ m: 1, width: '27ch' }} variant="outlined" disabled={true}>
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
          className={styles.select}
          // Adicione o evento onChange
          onChange={(e) => {handleSelectChange(e?.value, false)}}
          placeholder="Modulo Default"

        />
        <Select
          options={empresaOptions}
          className={styles.select}
          // Adicione o evento onChange
          onChange={(e) => {handleSelectChange(e?.value, true)}}
          placeholder="Empresa"

        />
        <FormControlLabel
          value={isAdmin}
          control={<Checkbox id="admin" checked={isAdmin} onChange={(e) =>{

            setIsAdmin(e.target.checked);
            setValue("admin", e.target.checked);
          }} />}
          label="Administrador"
          sx={{ m: 1.25, width: '27ch', justifyContent: "space-between" }}
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
            {draggableModulos.map((item) => {
              // if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
                return(
                  <div 
                  key={item.id}
                  className={styles.draggableItens}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  // onDragEnd={() => handleRemoveItem(item)}
                  >
                    {item.nome}
                  </div>
                )
              // }
            })}
              
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {modulosSelected.length === 0 && <h4>Arraste os Modulos aqui</h4>}
            {modulosSelected.map((item, index) => {
              // if(!item.hasOwnProperty("modulo") && !item.hasOwnProperty("menus_id") && !item.hasOwnProperty("itens_id")){
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
              // }
            })}
          </div>
        </div>
        {/* Fim do Bloco 01 -------------------------------------> */}

        {/* Bloco 02 --------------------------------------------> */}
        {modulosSelected.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Menus</h4>
            {draggableMenus.map((item) => {
              // if(item.hasOwnProperty("modulo")){
                const modulo = modulosSelected.find(modulo => modulo.nome === (item as MenuProps).modulo);
                if (modulo) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    // onDragEnd={() => handleRemoveItem(item)}
                    >
                      {item.nome}
                    </div>
                  )
                }
              // }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {menusSelected.length === 0 && <h4>Arraste os Menus aqui</h4>}
            {menusSelected.map((item, index) => {
              // if(item.hasOwnProperty("modulo")){
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
              // }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 02 -------------------------------------> */}
        {/* menusSelected.length > 0 */}
        
      </div>
      <div style={{display: "flex", flexDirection: "column"}}>
        {/* Bloco 03 --------------------------------------------> */}
        {menusSelected.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Itens</h4>
            {draggableItens.map((item) => {
              // if(item.hasOwnProperty("menus_id")){
                const found = menusSelected.find(menu => menu.id === item.menus_id);
                if (found) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    // onDragEnd={() => handleRemoveItem(item)}
                    >
                      {item.nome}
                    </div>
                  )
                }
              // }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {itensSelected.length === 0 && <h4>Arraste os itens aqui</h4>}
            {itensSelected.map((item, index) => {
              // if(item.hasOwnProperty("menus_id")){
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
              // }
            })}
          </div>
        </div>
        )}
        {/* Fim do Bloco 03 -------------------------------------> */}
      {/* Bloco 04 --------------------------------------------> */}
      {itensSelected.length > 0 && (
          <div style={{display: "flex", flexDirection: "row"}}>
          <div className={styles.draggableBoxOutput}>
            <h4>Relatorios</h4>
            {draggableRelatorios.map((item) => {
              // if(item.hasOwnProperty("itens_id")){
                const found = itensSelected.find(itensArray => itensArray.id === item.itens_id);
                if (found) {
                  return(
                    <div 
                    key={item.id}
                    className={styles.draggableItens}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    // onDragEnd={() => handleRemoveItem(item)}
                    >
                      {item.nome}
                    </div>
                  )
                }
              // }
            })}
          </div>
          
          <div
            className={styles.draggableBoxInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {relatoriosSelected.length === 0 && <h4>Arraste os relatorios aqui</h4>}
            {relatoriosSelected.map((item, index) => {
              // if(item.hasOwnProperty("itens_id")){
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
              // }
            })}
          </div>
        </div>
        )}
      </div>
        {/* Fim do Bloco 04 -------------------------------------> */}
    </div>
    )}
    </>
  );
}
