import SidebarMenu from "@/components/SideBarMenu";
import styles from './styles.module.css';
import { Header } from "@/components/header";
export default function Home() {
    return (


       <div className={styles.pageContainer}>
            <SidebarMenu/>
            <div className={styles.header}>
                <Header/>
            </div>
        </div>
 
        

    )
}