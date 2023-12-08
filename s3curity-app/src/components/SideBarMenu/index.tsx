import styles from './styles.module.css';
import { Sidebar, Menu, MenuItem, SidebarProps, SubMenu} from 'react-pro-sidebar';
import { HouseSimple, Buildings, User, ListDashes, ArrowDown, ChartLineUp } from 'phosphor-react';
import {useRouter} from 'next/router'
// import { useUserContext } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { useModuloContext } from '@/context/moduloContext';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

interface SidebarInfoProps{
  empresa: string;
}

interface MenuItemProps{
  nome: string;
  modulos_id: number;
  itens: itemProps[];
}

interface itemProps{
  nome: string;
  relatorios: relatorios[];
}

interface relatorios{
  nome: string;
  relatorio: string;
}

interface userProps{
  id: number;
  token: string;
  email: string;
  nome: string;
  acesso_admin: boolean;
  fotoPerfil: string;
}

export default function SidebarMenu(props: SidebarProps & SidebarInfoProps) {

    const router = useRouter();
    async function handleMenuClick (route: String) {
        router.push('/'+route + '/' + props.empresa);
    }

    const[user,setUser] = useState<userProps>();
    const [menus, setMenus] = useState<MenuItemProps[]>();
    const [filteredMenus, setFilteredMenus] = useState<MenuItemProps[]>();
    const[empresa, setEmpresa] = useState<string>();
    const[moduloDefault, setModuloDefault] = useState();
    const {modulo, setModulo} = useModuloContext();
    const[loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try{
          setEmpresa(JSON.parse(window.localStorage.getItem('empresa') || '{}').empresa || '');
          setUser(JSON.parse(window.localStorage.getItem('user') || '') as userProps);
          // if(user){
            const response = await api.get(`user/${(JSON.parse(window.localStorage.getItem('user') || '') as userProps).id}`);
            const menusFromApi = response.data.menus;
            console.log("MOdulo default From Api")
            console.log(response.data.modulo_default);
            setModuloDefault(response.data.modulo_default);
            setMenus(menusFromApi.map((menu: any) =>{
              return {
                nome: menu.nome,
                modulos_id: menu.modulos_id,
                itens: menu.itens.map((item: any) => {
                  return {
                    nome: item.nome,
                    relatorios: item.relatorios.map((relatorio: any) => {
                      return {
                        nome: relatorio.nome,
                        relatorio: relatorio.relatorio
                      }
                    })
                  }
                })
              }
            }));
            

          // }
        } catch (e) {
          console.error(e);
          alert(`Ocorreu um erro: ${e}`);
          setLoading(false);
        }
      }
      fetchData();
      setLoading(false);
    }, []);

    useEffect(() => {
      if (menus && menus.length > 0) {
        setFilteredMenus(
          menus.filter((menu: MenuItemProps) => menu.modulos_id === (modulo?.id !== 0 ? Number(modulo?.id) : moduloDefault))
        );
      }
    }, [menus, modulo, moduloDefault]);
    


  return (
    <div className={styles.container}>
      
      <div>
        <Sidebar {...props} className={styles.sideBar}>
              <Menu menuItemStyles={{
              button: ({ level, active, disabled }) => {
                  // only apply styles on first level elements of the tree
                  if (level === 0)
                  return {
                      color: disabled ? ' #A9A9A9.' : ' #A9A9A9.',
                      backgroundColor: active ? '#eecef9' : undefined,
                      marginTop: '1rem',
                  };
              },
              }}>
                  <div className={styles.userContainer}>
                    <SubMenu style={{width: "15rem"}} label={
                      <div style={{display: 'flex', flexDirection: 'row', gap: '0.25rem'}}>
                      <Avatar alt="U" src={user?.fotoPerfil}></Avatar>
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>
                                {user?.nome}
                            </div>
                            <p className={styles.userEmail}>
                                {user?.email}
                            </p>
                        </div>
                        <ArrowDown className={styles.arrowDown}/>
                      </div>
                    }>
                        {/* <div className={styles.userImage}></div> */}
                        <Link href={`/login/${props.empresa}`} style={{textDecoration: 'none'}} onClick={()=>{window.localStorage.removeItem('user')}}>
                        <MenuItem icon={<LogoutIcon/>}style={{color: 'red'}}>Logout</MenuItem>
                        </Link>
                    </SubMenu>
                  </div>
                  <Link href={`/home/${props.empresa}`} style={{textDecoration: 'none', color: 'black'}}>
                  <MenuItem icon={<HouseSimple/>}>
                    Home
                  </MenuItem>
                  </Link>

                  {empresa == 's3curity' && (
                    <>
                    <Link href={`/enterprises/${props.empresa}`} style={{textDecoration: 'none', color: 'black'}}>
                      <MenuItem icon={<Buildings/>}>Empresas</MenuItem>
                    </Link>
                    <Link href={`/itens/${props.empresa}`} style={{textDecoration: 'none', color: 'black'}}>
                      <MenuItem icon={<Buildings/>} >Itens</MenuItem>
                    </Link>
                    </>
                  )}
                  {user?.acesso_admin == true && (
                  <Link href={`/users/${props.empresa}`} style={{textDecoration: 'none', color: 'black'}}>
                  <MenuItem icon={<User/>}  >Usuários</MenuItem>
                  </Link>
                  )}
                  {filteredMenus && (
                    filteredMenus?.map((menu: MenuItemProps, index) => {
                      return (
                        <SubMenu key={index} label={menu.nome} icon={<ListDashes/>}>
                          {menu.itens.map((item: itemProps, index) => {
                            return (
                              <SubMenu key={index} label={item.nome} icon={<ListDashes/>}>
                                {item.relatorios.map((relatorio: relatorios, index) => {
                                  return (
                                    <MenuItem key={index} onClick={() => handleMenuClick(relatorio.relatorio)}>{relatorio.nome}</MenuItem>
                                  )
                                })}
                              </SubMenu>
                            )
                          })}
                        </SubMenu>
                      )
                    })
                    
                  )}
              
              </Menu>
              </Sidebar>
      </div> 
      
    </div>
  );
}
