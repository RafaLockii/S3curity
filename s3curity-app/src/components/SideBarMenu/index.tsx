import styles from './styles.module.css';
import { Sidebar, Menu, MenuItem, SidebarProps, SubMenu} from 'react-pro-sidebar';
import { HouseSimple, Buildings, User, ListDashes, ArrowDown, ChartLineUp } from 'phosphor-react';
import {useRouter} from 'next/router'

interface SidebarInfoProps{
  empresa: string;
}

export default function SidebarMenu(props: SidebarProps & SidebarInfoProps) {

    const router = useRouter();
    async function handleMenuClick (route: String) {
        router.push('/'+route);
    }

    const {empresa} = props;
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
                                Nome
                            </div>
                            <p className={styles.userEmail}>
                                email@email.com
                            </p>
                        </div>
                        <ArrowDown className={styles.arrowDown}/>
                  </div>
                  <MenuItem icon={<HouseSimple/>} onClick={()=> handleMenuClick('home')}>
                    Home
                  </MenuItem>

                  {empresa == 'S3curity' && (
                  <MenuItem icon={<Buildings/>} onClick={() => handleMenuClick('enterprises')}>Empresas</MenuItem>
                  )}
                  <MenuItem icon={<User/>} onClick={() => handleMenuClick('users')}>Usuários</MenuItem>

                  <SubMenu title="Menu" icon={<ListDashes/>} label='Menu'>
                        <SubMenu title='Itens' label='Itens' icon={<ListDashes/>}>
                        <MenuItem icon={<ChartLineUp/>} onClick={()=> handleMenuClick('reports')}>Relátorio</MenuItem>
                        </SubMenu>                    
                  </SubMenu>
                  
                
              </Menu>
              </Sidebar>
      </div> 
    </div>
  );
}
