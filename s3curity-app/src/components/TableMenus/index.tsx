import styles from './styles.module.css';
import  useRouter  from 'next/router';
import { MenuTableComponentProps, MenusData } from '@/types/types';
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

export default function CustomPaginationActionsTable({ data, empresa }: MenuTableComponentProps) {
let dataArray: MenusData[];
console.log(data);
// Verifique se data é um objeto com uma propriedade "datas"
if ('datas' in data) {
dataArray = data.datas;
} else {
dataArray = data as MenusData[];
}

if (!Array.isArray(dataArray)) {
// Verifique se data não é uma matriz e, se não for, retorne uma mensagem de erro ou um componente alternativo.
return <div>Os dados não são uma matriz válida.</div>;
}

const router = useRouter;
function handleEditUser() {
router.push('/user/editUser');
}
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

const handleCheckbox = (user: MenusData) => {
sessionStorage.setItem('selectedUser', JSON.stringify(user));
};
// console.log("Estrutura Menu");
// console.log(dataArray[0].itens.map((item)=>{
//     return item;
// }))
// console.log(dataArray[0].itens.map((item)=>{
//     return item.relatorios.map((relatorio)=>{
//         return relatorio.nome
//     });
// }))



return (
<div className={styles.tableContainer}>
<TableContainer component={Paper}  >
    <Table sx={{ minWidth: 400 }} aria-label="custom pagination table">
    <TableHead sx={{
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    height: '10vh',
    }}>
        <TableRow>
        <TableCell>Nome</TableCell>
        <TableCell>Modulo</TableCell>
        <TableCell>Quantidade itens</TableCell>
        <TableCell>Quantidade relatórios</TableCell>
        <TableCell></TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {(rowsPerPage > 0
        ? dataArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : dataArray
        ).map((row) => (
        <TableRow key={row.id}>
            
            <TableCell>{row.nome}</TableCell>
            <TableCell>{row.modulo}</TableCell>
            <TableCell>{row.itens.length}</TableCell>
            <TableCell>{row.itens.reduce((accumulator, currentItem) => accumulator + currentItem.relatorios.length, 0)}</TableCell>
            <TableCell>
            <button className={styles.button} onClick={() => { router.push(`editMenu/${row.id}/${empresa}`)}}>Editar</button>
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
</div>
);
}