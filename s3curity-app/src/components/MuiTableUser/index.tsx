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
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/lib/axios';
import { Alert, Avatar, Button } from '@mui/material';
import { useState, useEffect } from 'react';


interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function CustomPaginationActionsTable({ data, empresa }: TableComponentProps) {
  const [dataArray, setDataArray] = useState<TableData[]>([]);
  const[requestApi, setRequestApi] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  //   let dataArray: TableData[];
  // console.log(data);
  // // Verifique se data é um objeto com uma propriedade "datas"
  // if ('datas' in data) {
  //   dataArray = data.datas;
  // } else {
  //   dataArray = data as TableData[];
  // }

  if (!Array.isArray(dataArray)) {
    // Verifique se data não é uma matriz e, se não for, retorne uma mensagem de erro ou um componente alternativo.
    return <div>Os dados não são uma matriz válida.</div>;
  }

  useEffect(() => {
    let dataToSet: TableData[] = [];
    // Assuming data is updated externally (props) and used to update dataArray state
    if ('datas' in data) {
      dataToSet = data.datas;
    } else {
      dataToSet = data as TableData[];
    }
    setDataArray(dataToSet);
  }, [data]);



  const router = useRouter;
  function handleEditUser() {
    router.push('/user/editUser');
  }
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const[newRender, setNewRender] = useState(false);
  const[boxChecked, setBoxChecked] = useState<number | null>();

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataArray.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isChecked = (id: number): boolean => {
    if(boxChecked == null){
      return false;
    } else{
      return id != boxChecked;
    }
  }

  const handleCheckbox = (user: TableData, checked: boolean) => {
    if(checked){
      setBoxChecked(user.id);
      sessionStorage.setItem('selectedUser', JSON.stringify(user));
    } else if(!checked){
      setBoxChecked(null);
      sessionStorage.removeItem('selectedUser');
    }
    
  };

  const handleEdit = (user: TableData) =>{
    sessionStorage.setItem('editedUser', JSON.stringify(user));
    router.push(`editUser/${user.id}/${empresa}`)
  }


  const deleteUser = async (id: number) => {
    try {
      await api.delete(`user/${id}`);
      // Remove the user from the dataArray after successful deletion
      const updatedDataArray = dataArray.filter((user) => user.id !== id);
      setDataArray(updatedDataArray); // Update dataArray state to reflect the deletion immediately
    } catch (e) {
      console.log(e);
    }
  };
  // const deleteUser = async (id: number)=>{
  //   try{
  //     const response = await api.delete(`user/${id}`);
  //     const updatedDataArray = dataArray.filter((user) => user.id !== id);
  //     dataArray = updatedDataArray;
  //   }catch(e){
  //     console.log(e)
  //   }
  // }

  return (
    <div className={styles.tableContainer}>
      {dataArray && (
    <TableContainer component={Paper}  >
      <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
        <TableHead sx={{
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        height: '10vh',
        }}>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Operacional</TableCell>
            <TableCell>Estratégico</TableCell>
            <TableCell>Gerencial</TableCell>
            <TableCell>Ativo</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? dataArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : dataArray
          ).map((row) => (
            
            <TableRow key={row.id}>
                <TableCell>
                <Checkbox
                disabled={isChecked(row.id)}
                onChange={(e) => handleCheckbox(row, e.target.checked)}
                />
              </TableCell>
              <TableCell >
                <Avatar alt="U" src={row.funcionario.imagem.url}/>
                {row.nome}
              </TableCell>
              <TableCell>{row.funcionario.empresa.nome}</TableCell>
              <TableCell>
                <Checkbox
                  checked={row.funcionario.modulos.some(modulo => modulo.nome === "OPERACIONAL")}
                  disabled
                />
              </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.funcionario.modulos.some(modulo => modulo.nome === "ESTRATEGICO")}
                  disabled
                />
                </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.funcionario.modulos.some(modulo => modulo.nome === "GERENCIAL")}
                  disabled
                />
                </TableCell>
                <TableCell>
                <Checkbox
                  checked={row.verified}
                  disabled
                />
                </TableCell>
                <TableCell>
                <button className={styles.button} onClick={() => { handleEdit(row);}}>Editar</button>
                </TableCell>
                <TableCell>
                <IconButton aria-label="delete" onClick={()=>{setShowAlert(true)}}>
                  <DeleteIcon color='error' />
                </IconButton>
                <div className={styles.alertWrapper}>
                  {showAlert && (
                    <Alert
                      className={styles.alert}
                      onClose={() => {
                        setShowAlert(false);
                      }}
                      severity="warning"
                      action={
                        <div>
                          <Button
                            color="inherit"
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              deleteUser(row.id); // Call deleteUser function passing the ID
                              setShowAlert(false);
                              setNewRender(true); // Close the alert after deletion
                            }}
                          >
                            Deletar
                          </Button>
                          <Button
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setShowAlert(false); // Close the alert without deleting
                            }}
                          >
                            Cancelar
                          </Button>
                        </div>
                      }
                    >
                      Tem certeza que deseja deletar este usuário?
                    </Alert>
                  )}
                </div>
                </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={dataArray.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    )}
    </div>
  );
}