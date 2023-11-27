export interface EmpresaData {
    id: number;
    nome: string;
    cnpj: string;
    logo: string;
    data_alt: any;
    data_criacao: string;
    imagem_fundo: string;
    usuario_criacao: string;
    usuario_cad_alt: any;
}
  
  //Propriedades recebidas da rota
export interface CreateUserformProps {
    empresa: string;
    empresaid: number;
    empresas: EmpresaData[];
}

export interface draggableItensProps{
    label: string;
    type: string;
}
export interface MenuProps{
    id: number;
    nome: string;
    modulo: string;
}

export interface TableData {
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
  
export interface TableComponentProps {
    data: TableData[] | { datas: TableData[] };
    empresa: string;
}

// Blocod e tipagem dos dados de menu

export interface MenusData{
    [x: string]: any;
    id: number;
    nome: string;
    modulo: string;
    itens: itens[];
}

interface itens{
    id: number;
    nome: string;
    menus_id: number;
    relatorios: relatorios[];

}

interface relatorios{
    id: number;
    nome: string;
    relatorio: string;
    itens_id: number;
}

export interface MenuTableComponentProps{
    data: MenusData[] | {datas: MenusData[]};
    empresa: string;
}

//---------------------------------------------->

export interface EmpresaTableData {
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
  
export interface EmpresaTableComponentProps {
    data: EmpresaTableData[] | {datas: EmpresaTableData[]};
    empresa: string;
}

export interface updateFormProps {
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

export interface UserData {
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

export interface MenuItem {
    nome: string;
    relatorios: { nome: string; relatorio: string }[];
}
  
export interface MenuData {
    nomeMenu: string;
    empresa_id: number;
    modulo_id: number | string;
    itens: MenuItem[];
}

export interface UpdateMenuProps{
    menu: MenusData; 
}