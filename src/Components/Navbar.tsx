"use client"

import React, { useState } from 'react'
import logo from '../../public/images/logo.png'
import { Avatar, Drawer, IconButton, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/Utils/AuthContext';

const Navbar = () => {
    const location = window.location
    const userContext = useUserContext()
    const router = useRouter()
    const [avatarAnchorEl, setAvatarAnchorEl] = React.useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
    const avatarOpen = Boolean(avatarAnchorEl);
    const notificationOpen = Boolean(notificationAnchorEl)
    const [toggleDrawer, setToggleDrawer] = useState(false)
    const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAvatarAnchorEl(event.currentTarget);
    };
    const handleAvatarClose = () => {
        setAvatarAnchorEl(null);
    };
    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setNotificationAnchorEl(event.currentTarget)
    }
    const handleNotificationClose = () => {
        setNotificationAnchorEl(null)
    }
    function stringToColor(string: string) {
        let hash = 0;
        let i;
      
        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
          hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
      
        let color = '#';
      
        for (i = 0; i < 3; i += 1) {
          const value = (hash >> (i * 8)) & 0xff;
          color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */
      
        return color;
      }
      
      function stringAvatar(name: string) {
        return {
          sx: {
            bgcolor: stringToColor(name),
          },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }
    return (
        <div className='w-full flex p items-center justify-between py-5' style={{height:'100px'}}>
            <img onClick={()=>{router.replace('/dashboard')}} className='hidden md:block lg:block xl:block cursor-pointer' src={logo.src} alt="logo" style={{height:'100%'}} />
            <nav className='hidden md:flex lg:flex xl:flex ' style={{backgroundColor:'rgb(243, 243, 243)', borderRadius:'15px'}}>
                <a href='/dashboard' className={`nav-a-tag${location.pathname === '/dashboard' ? '-active' : ''}`}>Home</a>
                <a href='/active' className={`nav-a-tag${location.pathname === '/active' ? '-active' : ''}`}>Queue</a>
                <a href='/create' className={`nav-a-tag${location.pathname === '/create' ? '-active' : ''}`}>Availability</a>
                <a href='/history' className={`nav-a-tag${location.pathname === '/history' ? '-active' : ''}`}>Rubrics</a>
            </nav>
            <div className='block md:hidden lg:hidden xl:hidden'>
                <IconButton onClick={()=>{setToggleDrawer(true)}}>
                    <MenuIcon/>
                </IconButton>
                <Drawer open={toggleDrawer} onClose={()=>{setToggleDrawer(false)}}>
                <nav className='flex flex-col gap-3 p-5' style={{backgroundColor:'rgb(243, 243, 243)', borderRadius:'15px'}}>
                    <a href='/dashboard' className={`nav-a-tag${location.pathname === '/dashboard' ? '-active' : ''}`}>Home</a>
                    <a href='/active' className={`nav-a-tag${location.pathname === '/active' ? '-active' : ''}`}>Queue</a>
                    <a href='/create' className={`nav-a-tag${location.pathname === '/create' ? '-active' : ''}`}>Availability</a>
                    <a href='/history' className={`nav-a-tag${location.pathname === '/history' ? '-active' : ''}`}>Rubrics</a>
                </nav>
                </Drawer>
            </div>
            <div style={{display:'flex', gap:10, position:'relative'}}>
                <IconButton style={{color:'silver'}} onClick={handleNotificationClick}>
                    <NotificationsIcon style={{fontSize:'2.3rem'}}/>
                </IconButton>
                <IconButton style={{color:'silver'}} onClick={handleAvatarClick}>
                    <Avatar {...stringAvatar(`${userContext.user?.firstname} ${userContext.user?.lastname}`)}/>
                </IconButton>
                <Menu
                    anchorEl={avatarAnchorEl}
                    open={avatarOpen}
                    onClose={handleAvatarClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                    anchorOrigin={{
                        vertical:'bottom',
                        horizontal:'center'
                    }}
                    transformOrigin={{
                        vertical:'top',
                        horizontal:'right'
                    }}
                >
                    <MenuItem onClick={handleAvatarClose}>Profile</MenuItem>
                    <MenuItem onClick={handleAvatarClose}>My account</MenuItem>
                    <MenuItem onClick={handleAvatarClose}>Logout</MenuItem>
                </Menu>
                <Menu
                    anchorEl={notificationAnchorEl}
                    open={notificationOpen}
                    onClose={handleNotificationClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        sx:{
                            // width:'50%',
                            // backgroundColor:'black'
                            padding:'1em'
                        }
                    }}
                    PaperProps={{
                        sx:{
                            width:'40%'
                        }
                    }}
                    anchorOrigin={{
                        vertical:'bottom',
                        horizontal:'center'
                    }}
                    transformOrigin={{
                        vertical:'top',
                        horizontal:'right'
                    }}
                >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Recusandae molestiae, facere odit quasi dolorum distinctio repellendus eius a fugit dignissimos! Consequatur nostrum assumenda incidunt vitae tenetur architecto ducimus at consectetur?
                </Menu>
            </div>
        </div>
    )
}

export default Navbar
