import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import styles from './styles.module.css';
import CreateForm from "./components/createForm";

export default function Enterprise(){
    return(
        <div className={styles.pageContainer}>
            <SidebarMenu/>
            <div className={styles.createFormContainer}>
                <CreateForm/>
            </div>
            <div className={styles.header}>
                <Header/>
            </div>
        </div>
    )
}