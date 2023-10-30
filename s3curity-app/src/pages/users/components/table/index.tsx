import styles from './styles.module.css';

interface TableData {
  nome: string;
  empresa: string;
  operacional: boolean;
  estrategico: boolean;
  gerencial: boolean;
  ativo: boolean;
}

export default function TableComponent({ data }: { data: TableData[] | { datas: TableData[] } }) {
  let dataArray: TableData[];

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
              <td>{item.empresa}</td>
              <td>
                <input type="checkbox" checked={item.operacional} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.estrategico} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.gerencial} disabled />
              </td>
              <td>
                <input type="checkbox" checked={item.ativo} disabled />
              </td>
              <td>
                {/* Depois podemos usar um router para a página de edição passando os dados como parâmetro */}
                <button className={styles.button}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
