import styles from './styles.module.css';
import  useRouter  from 'next/router';
import { TableComponentProps, TableData } from '@/types/types';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';


export default function TableComponent({ data, empresa }: TableComponentProps) {
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
      
      <>
      <Table size="small" >
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Operacional</TableCell>
            <TableCell>Estratégico</TableCell>
            <TableCell>Gerencial</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataArray.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.nome}</TableCell>
              <TableCell>{row.funcionario.empresa.nome}</TableCell>
              <TableCell>
                <Checkbox
                  checked={row.funcionario.cargo.nome_cargo == "Operacional"}
                  disabled
                />
              </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.funcionario.cargo.nome_cargo == "Estratégico"}
                  disabled
                />
                </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.funcionario.cargo.nome_cargo == "Gerencial"}
                  disabled
                />
                </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.funcionario.ativo}
                  disabled
                />
                </TableCell>
                <TableCell>
                <button className={styles.button} onClick={() => { router.push(`editUser/${row.id}/${empresa}`)}}>Editar</button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
    </div>
  );
}
