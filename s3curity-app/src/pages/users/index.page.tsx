import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import CreateUserForm from "./createUserForm";
import styles from './styles.module.css';


export default function Users(){
    return(
        <div className={styles.pageContainer}>
            <SidebarMenu/>
            <div className={styles.createUserFormContainer}>
                <CreateUserForm/>
            </div>
            <div className={styles.header}>
                <Header/>
            </div>            
        </div>
    )
}