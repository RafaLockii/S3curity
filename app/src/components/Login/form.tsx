import { useContext, useState } from "react"
import AuthContext from "../../contexts/auth"

interface LoginProps {
    email: string
    senha: string
}

export default function Form() {
    const context = useContext(AuthContext)
    console.log(context)

    const [Form, setForm] = useState<LoginProps>({
        email: "",
        senha: ""
    })


    function handleLogin() {
        context.Login(Form.email, Form.senha);

    }

    return <>
        <div>
            <input name="email" type="email" placeholder="Email..." value={Form.email} onChange={(e) => setForm({
                ...Form,
                email: e.target.value
            })} />
            <input name="senha" type='password' placeholder="Senha..." value={Form.senha} onChange={(e) => setForm({
                ...Form,
                senha: e.target.value
            })} />
            <button onClick={handleLogin}>
                Entrar
            </button>
        </div>
    </>
}
