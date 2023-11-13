import styles from './styles.module.css';
import { Sidebar, Menu, MenuItem, SidebarProps, SubMenu} from 'react-pro-sidebar';
import { HouseSimple, Buildings, User, ListDashes, ArrowDown, ChartLineUp } from 'phosphor-react';
import {useRouter} from 'next/router'
import { useUserContext } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

interface SidebarInfoProps{
  empresa: string;
}

interface MenuItemProps{
  nome: string;
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
}

export default function SidebarMenu(props: SidebarProps & SidebarInfoProps) {

    const router = useRouter();
    async function handleMenuClick (route: String) {
        router.push('/'+route + '/' + props.empresa);
    }
    // const {empresa} = props;
    // const {user, setUser} = useUserContext();

    const[user,setUser] = useState<userProps>();
    const [menus, setMenus] = useState<MenuItemProps[]>();
    const[empresa, setEmpresa] = useState<string>();

    useEffect(() => {
      const fetchData = async () => {
        try{
          setEmpresa(JSON.parse(window.localStorage.getItem('empresa') || '{}').empresa || '');
          setUser(JSON.parse(window.localStorage.getItem('user') || '') as userProps);
          // if(user){
            const response = await api.get(`user/${(JSON.parse(window.localStorage.getItem('user') || '') as userProps).id}/menus`);
            const menus = response.data.funcionario.menus;
            console.log(menus)
            setMenus(menus.map((menu: any) =>{
              return {
                nome: menu.nome,
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
        }
      }
      fetchData();
    }, []);

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
                        <div className={styles.userImage}></div>
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
                  <MenuItem icon={<HouseSimple/>} onClick={()=> handleMenuClick('home')}>
                    Home
                  </MenuItem>

                  {empresa == 's3curity' && (
                  <MenuItem icon={<Buildings/>} onClick={() => handleMenuClick('enterprises')}>Empresas</MenuItem>
                  )}
                  {user?.acesso_admin == true && (
                   <MenuItem icon={<User/>} onClick={() => handleMenuClick('users')}>Usuários</MenuItem>
                  )}
                  {menus && (
                    menus?.map((menu: MenuItemProps) => {
                      return (
                        <SubMenu label={menu.nome} icon={<ListDashes/>}>
                          {menu.itens.map((item: itemProps) => {
                            return (
                              <SubMenu label={item.nome} icon={<ListDashes/>}>
                                {item.relatorios.map((relatorio: relatorios) => {
                                  return (
                                    <MenuItem onClick={() => handleMenuClick(relatorio.relatorio)}>{relatorio.nome}</MenuItem>
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
