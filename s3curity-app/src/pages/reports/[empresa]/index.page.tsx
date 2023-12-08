'use client'
import SidebarMenu from "@/components/SideBarMenu"
import styles from './styles.module.css';
import { Header } from "@/components/header";
import useRouter from "next/router";

export default function Reports(){
    const {query} = useRouter;
    const empresa = typeof query.empresa ==='string' ? query.empresa : '';

    return(
        <div className={styles.pageContainer}>
            <SidebarMenu empresa={empresa}/>
            <div className={styles.header}>
                <Header/>
            </div>
        </div>
    )
}