import styles from './styles.module.css';
import { Sidebar, Menu, MenuItem, SidebarProps, SubMenu} from 'react-pro-sidebar';
import { HouseSimple, Buildings, User, ListDashes, ArrowDown, ChartLineUp } from 'phosphor-react';
import {useRouter} from 'next/router'
import { useUserContext } from '@/context/UserContext';
import { useState, useEffect } from 'react';

interface SidebarInfoProps{
  empresa: string;
}

interface MenuItemProps{
  label: string;
  itens: itemProps[];
}

interface itemProps{
  label: string;
}

export default function SidebarMenu(props: SidebarProps & SidebarInfoProps) {

    const router = useRouter();
    async function handleMenuClick (route: String) {
        router.push('/'+route + '/' + props.empresa);
    }
    const {empresa} = props;
    const {user} = useUserContext();
    const [menuItens, setMenuItens] = useState<MenuItemProps[]>();

    useEffect(() => {
      setMenuItens([
        {
          label: 'Menu 01',
          itens: [
            {
              label: 'Item 01',
            },
            {
              label: 'Item 02',
            },
            {
              label: 'Item 03',
            },
          ],
        },
        {
          label: 'Menu 02',
          itens: [
            {
              label: 'Item 01',
            },
            {
              label: 'Item 02',
            },
            {
              label: 'Item 03',
            },
          ],
        },
        {
          label: 'Menu 02',
          itens: [
            {
              label: 'Item 01',
            },
            {
              label: 'Item 02',
            },
            {
              label: 'Item 03',
            },
          ],
        },
      ]);
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
                  <SubMenu title="Menu" icon={<ListDashes/>} label='Menu'>
                        {menuItens?.map((menu) => (
                          <SubMenu title={menu.label} icon={<ListDashes/>} label={menu.label}>
                            {menu.itens.map((subItem) => (
                              <MenuItem icon={<ChartLineUp/>} onClick={()=> handleMenuClick('reports')}>{subItem.label}</MenuItem>
                            ))}
                          </SubMenu>
                        ))}
                  </SubMenu>
                  
                
              </Menu>
              </Sidebar>
      </div> 
    </div>
  );
}
