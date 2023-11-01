import { useRouter } from 'next/router';
import styles from './styles.module.css';

interface TableData {
  id: number;
  nome: string;
  razao_s: string;
  logo: string;
  data_alt: any;
  data_criacao: string;
  imagem_fundo: string;
  usuario_criacao: string;
  usuario_cad_alt: any;
}

interface TableComponentProps {
  data: TableData[] | {datas: TableData[]};
  empresa: string;
}

export default function TableComponent({ data, empresa }: TableComponentProps) {
  let dataArray: TableData[];
  console.log(data);
  // Verifique se data é um objeto com uma propriedade "datas"
  if ('datas' in data) {
    dataArray = data.datas;
  } else {
    dataArray = data as TableData[];
  }
  if(!Array.isArray(dataArray)){
    // Verifique se data não é uma matriz e, se não for, retorne uma mensagem de erro ou um componente alternativo.
    return <div>Os dados não são uma matriz válida.</div>;
  }

  const router = useRouter();





  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Razão social</th>
            <th>Usuário criação</th>
            <th>Data de Criação</th>
            <th>Ativo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataArray.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>
                {/* <input type="checkbox" checked={item.operacional} disabled /> */}
                {item.razao_s}
              </td>
              <td>
                {item.usuario_criacao}
              </td>
              <td>
                {/* <input type="checkbox" checked={item.gerencial} disabled /> */}
                {item.data_criacao}
              </td>
              <td>
                <input type="checkbox" checked={true} disabled />
              </td>
              <td>
                {/* Depois podemos suar um router para a pag de edição passando os dados daq como parametro */}
                <button className={styles.button} onClick={()=>{
                  router.push(`editEmpresa/${item.id}/${empresa}`)
                }}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
