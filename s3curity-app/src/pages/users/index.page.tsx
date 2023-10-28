import SidebarMenu from "@/components/SideBarMenu";
import { Header } from "@/components/header";
import CreateUserForm from "./components/createUserForm";
import styles from './styles.module.css';
import UpdateForm from "./components/updateForm";


export default function Users(){
    return(
        <div className={styles.pageContainer}>
            <SidebarMenu/>
            <div className={styles.createUserFormContainer}>
                {/* <CreateUserForm/> */}
                <UpdateForm/>
            </div>
            <div className={styles.header}>
                <Header/>
            </div>            
        </div>
    )
}