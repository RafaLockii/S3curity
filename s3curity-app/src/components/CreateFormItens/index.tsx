import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import {MenuData } from "@/types/types";
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Validação do formulário
const registerFormShceme = z.object({
  nome: z.optional(z.string()), 
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

  const { back } = useRouter();

  const[modulo, setModulo] = useState([]);

  //Bloco de código refrente a criação de menus --------------------------------------->
  const [numMenuInputs, setNumMenuInputs] = useState(1);
  const [menus, setMenus] = useState<MenuData[]>([{ nomeMenu: '', empresa_id: 0, modulo_id: 0, itens: [] }]);

  const addMenuInput = () => {
    setNumMenuInputs(numMenuInputs + 1);
  };

  const addItemInput = (menuIndex: number) => {
    const newMenus = [...menus];
  
    // Certifique-se de que newMenus[menuIndex] está definido
    if (!newMenus[menuIndex]) {
      newMenus[menuIndex] = {
        nomeMenu: '', 
        empresa_id: 0, 
        modulo_id: 0, 
        itens: [], // Inicialize como um array vazio
      };
    }
  
    // Certifique-se de que newMenus[menuIndex].itens está definido
    if (!newMenus[menuIndex].itens) {
      newMenus[menuIndex].itens = [];
    }
  
    // Adicione um novo item ao array
    newMenus[menuIndex].itens.push({
      nomeItem: "",
      relatorios: [],
    });
  
    setMenus(newMenus);
  };

  const addRelatorioInput = (menuIndex: number, itemIndex: number) => {
    const newMenus = [...menus];
    newMenus[menuIndex].itens[itemIndex].relatorios.push({
      nome: "",
      relatorio: "",
    });
    setMenus(newMenus);
  };

   //FIm do bloco ------------------------------------------------------------------------>
  async function handleRegister(data: RegisterFormData) {
    console.log("entrou aq");
    try {
    const menuResponses = await Promise.all(
      menus.map((menu) => api.post("menu/create", menu))
    );
      back();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit(handleRegister)}>
        {/* FORMS DOS MENUS -------------------------------------------------------> */}

        <div style={{flexDirection: 'row', display: 'flex'}}>
          {Array.from({ length: numMenuInputs }).map((_, menuIndex) => (
            <div key={menuIndex} className={styles.menu}>
              <div className={styles.inputWithContents}>
            
                <TextField
                  id="outlined-error"
                  label="Menu"
                  onChange={(e) => {
                    const newMenus = [...menus];
                    newMenus[menuIndex] = {
                      ...newMenus[menuIndex],
                      nomeMenu: e.target.value,
                    };
                    setMenus(newMenus);
                  }}
                />
              </div>

              <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-helper-label">Módulo</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={menus[menuIndex]?.modulo_id ? menus[menuIndex]?.modulo_id : 0} 
                label="Modulo"
                onChange={(e) => {
                  console.log(e.target.value);
                  const newMenus = [...menus];
                  newMenus[menuIndex] = {
                    ...newMenus[menuIndex],
                    modulo_id: e.target.value,
                  };
                  setMenus(newMenus);
                }}
              >
                <MenuItem value={1}>Operacional</MenuItem>
                <MenuItem value={2}>Estratégico</MenuItem>
                <MenuItem value={3}>Gerencial</MenuItem>
              </Select>
              <FormHelperText>Selecione o módulo</FormHelperText>
            </FormControl>


              {menus[menuIndex] && menus[menuIndex]?.itens && menus[menuIndex]?.itens.map((item, itemIndex) => (
                <div key={itemIndex} className={styles.item}>
                  <div className={styles.inputWithContents}>
                    
                    <TextField
                    placeholder={`Nome do Item ${itemIndex + 1}`}
                    onChange={(e) => {
                      const newMenus = [...menus];
                      newMenus[menuIndex].itens[itemIndex] = {
                        ...newMenus[menuIndex].itens[itemIndex],
                        nomeItem: e.target.value,
                      };
                      setMenus(newMenus);
                    }}
                    />
                  </div>

                  {item.relatorios.map((relatorio, relatorioIndex) => (
                    <div key={relatorioIndex} className={styles.relatorio}>
                      <div className={styles.inputWithContents}>
                       
                          <TextField
                          placeholder={`Nome do Relatório ${relatorioIndex + 1}`}
                          onChange={(e) => {
                            const newMenus = [...menus];
                            newMenus[menuIndex].itens[itemIndex].relatorios[relatorioIndex].nome = e.target.value;
                            newMenus[menuIndex].itens[itemIndex].relatorios[relatorioIndex].relatorio = e.target.value;
                            setMenus(newMenus);
                          }}
                          />

                      </div>
                      <div className={styles.inputWithContents}>
                       
                        <TextField
                        placeholder={`Relatório ${relatorioIndex + 1}`}
                        onChange={(e) => {
                          const newMenus = [...menus];
                          newMenus[menuIndex].itens[itemIndex].relatorios[relatorioIndex].relatorio = e.target.value;
                          setMenus(newMenus);
                        }}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    className={styles.addInput}
                    type="button"
                    onClick={() => addRelatorioInput(menuIndex, itemIndex)}
                  >
                    Relatório +
                  </button>
                </div>
              ))}
              <button
                className={styles.addInput}
                type="button"
                onClick={() => addItemInput(menuIndex)}
              >
                Item +
              </button>
            </div>
          ))}
        </div>

        <Button
        variant="contained"
        onClick={addMenuInput}
        size="small"
        className={styles.addMenuInput}
        endIcon={<AddCircleIcon />}
        >
          Menu
        </Button>

        <button className={styles.createUserButton} type="submit">
          Salvar
        </button>
      </form>
   

    </div>
  );
}
