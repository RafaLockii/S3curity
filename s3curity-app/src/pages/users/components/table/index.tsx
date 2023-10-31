import styles from './styles.module.css';
import  useRouter  from 'next/router';

interface TableData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  acesso_admin: boolean;
  ativo: boolean;
  funcionario: {
    acesso_admin: boolean;
    ativo: boolean;
    imagem: { url: string };
    cargo: { nome_cargo: string; permissoes: string };
    empresa: { nome: string };
  }
}

export default function TableComponent({ data }: { data: TableData[] | { datas: TableData[] } }) {
  let dataArray: TableData[];
  console.log(data);
  // Verifique se data é um objeto com uma propriedade "datas"
  if ('datas' in data) {
    dataArray = data.datas;
  } else {
    dataArray = data as TableData[];
  }

  if (!Array.isArray(dataArray)) {
    // Verifique se data não é uma matriz e, se não for, retorne uma mensagem de erro ou um componente alternativo.
    return <div>Os dados não são uma matriz válida.</div>;
  }

  const router = useRouter;
  function handleEditUser() {
    router.push('/user/editUser');
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Empresa</th>
            <th>Operacional</th>
            <th>Estratégico</th>
            <th>Gerencial</th>
            <th>Ativo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.funcionario.empresa.nome}</td>
              <td>
                <input type="checkbox" checked={item.funcionario.cargo.nome_cargo == "Operacional"} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.funcionario.cargo.nome_cargo == "Estratégico"} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.funcionario.cargo.nome_cargo == "Gerencial"} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.funcionario.ativo} disabled />
              </td>
              <td>
                {/* Depois podemos usar um router para a página de edição passando os dados como parâmetro */}
                <button className={styles.button} onClick={() => { router.push(`editUser/${item.id}`)}}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
