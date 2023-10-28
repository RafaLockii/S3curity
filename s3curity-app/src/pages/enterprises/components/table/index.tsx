import styles from './styles.module.css';

interface TableData {
  nome: string;
  operacional: boolean;
  estrategico: boolean;
  gerencial: boolean;
  ativo: boolean;
}

export default function TableComponent({ data }: { data: TableData[] }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Operacional</th>
            <th>Estratégico</th>
            <th>Gerencial</th>
            <th>Ativo</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
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
                {/* Depois podemos suar um router para a pag de edição passando os dados daq como parametro */}
                <button className={styles.button}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
