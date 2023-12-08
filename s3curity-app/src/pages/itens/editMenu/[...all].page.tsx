'use client'
import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import UpdateForm from "../../../components/UpdateItemForm";
import { useEffect, useState } from "react";
import { ArrowLeft } from "phosphor-react";
import  useRouter from "next/router";
import { api } from "@/lib/axios";
import { MenusData } from "@/types/types";



export default function EditUsers(){

const [menuData, setmenuData] = useState<MenusData>();


    //Resgatando data da URL
const {query, back} = useRouter;

let data: string[] = [];

if (typeof query.all === 'string') {
    // Se query.all for uma string, converta-a em um array
    data.push(query.all);
    } else if (Array.isArray(query.all)) {
    // Se query.all for um array, use-o diretamente
    data = query.all;
    }
    
    if (data.length > 0) {
    // A variável data contém pelo menos um valor
    const id = data[0];
    const empresa = data[1] || '';
    console.log("id recebido: " + id);
    console.log("empresa recebida: " + empresa);
    } else {
    // A variável data está vazia
    console.log('Nenhum parâmetro encontrado na URL');
    }

useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await api.get(`menu/${data[0]}`);
            setmenuData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
}, []);

console.log("Menu na editMenu: ")
console.log(menuData); 
if(menuData){
    console.log(menuData.itens)
}


return (
    <div className={styles.pageContainer}>
      <SidebarMenu empresa={data[1]} />
      {menuData !== undefined ? (
        <div className={styles.createUserFormContainer}>
          <div className={styles.formHeader}>
            <p>Edição</p>
            <ArrowLeft className={styles.arrowLeft} onClick={() => back()} />
          </div>
          <UpdateForm menu={menuData} // Pass itens or an empty array if undefined
          />
        </div>
      ) : (
        <div>Carregando...</div>
      )}
      <div className={styles.header}>
        <Header />
      </div>
    </div>
  );
}