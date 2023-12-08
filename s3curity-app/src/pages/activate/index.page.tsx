'use client'
import FormForgotPassWord from "@/components/FormForgotPassWord";
import FormLogin from "@/components/FormsLogin";
import styles from './styles.module.css'
import ActivateUser from "@/components/Activateuser";

export default function ForgotPassword() {

    return(
        <div className={styles.mainContainer}>
        <ActivateUser/>
        </div>
    )
}