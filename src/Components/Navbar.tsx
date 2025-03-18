"use client"

import React, { useEffect, useState } from 'react'
import logo from '../../public/images/logo.png'
import { Avatar, Drawer, IconButton, Menu, MenuItem } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/Contexts/AuthContext';
import { stringAvatar } from '@/Utils/Utility_functions';
import { NotificationRecipient, QUEUEIT_URL, UserType } from '@/Utils/Global_variables';
import { useWebSocket } from '@/WebSocket/WebSocketContext';
import Notification from './Notification';

const Navbar = () => {
    const user = useUserContext().user
    const client = useWebSocket();
    const location = window.location
    const userContext = useUserContext()
    const router = useRouter()
    const [avatarAnchorEl, setAvatarAnchorEl] = React.useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);
    const avatarOpen = Boolean(avatarAnchorEl);
    const notificationOpen = Boolean(notificationAnchorEl)
    const [toggleDrawer, setToggleDrawer] = useState(false)
    const [notifications, setNotifications] = useState<Array<NotificationRecipient>>([]);
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

    const handleNotificationRedirectionClick = (uri:string)=>{
        router.push(uri)
    }

    const notificationSound = '/sounds/alert.wav';

    useEffect(()=>{
        if(client){
            const notificationSubscription = client.subscribe(`/topic/notification/${user?.uid}`, (message) => {
                const receivedMessage:NotificationRecipient = JSON.parse(message.body);
                setNotifications((prev)=>[receivedMessage, ...prev])
                const audio = new Audio(notificationSound)
                audio.play().catch(err => console.error("Audio play failed:",err));
            });
            return ()=>{
                notificationSubscription.unsubscribe();
            }
        }
    },[client])

    useEffect(()=>{
        if(user){
            fetch(`${QUEUEIT_URL}/notifications/${user.uid}`)
            .then(async(res)=>{
                if(res.ok){
                    const response:Array<NotificationRecipient> = await res.json();
                    // console.log(response)
                    setNotifications((prev)=>[...response, ...prev])
                }else{
                    console.log("could not retrieve notifications.")
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    },[user])
    
    return (
        <div className='w-full flex p items-center justify-end md:justify-between lg:justify-between xl:justify-between py-5 relative' style={{height:'100px', zIndex:3}}>
            <img onClick={()=>{router.replace('/dashboard')}} className='hidden md:block lg:block xl:block cursor-pointer' src={logo.src} alt="logo" style={{height:'100%'}} />
            {userContext.user?.role == UserType.FACULTY?
                <>
                    <nav className='hidden md:flex lg:flex xl:flex ' style={{backgroundColor:'rgb(243, 243, 243)', borderRadius:'15px'}}>
                        <a href='/dashboard' className={`nav-a-tag${location.pathname.includes('/dashboard')  ? '-active' : ''}`}>Home</a>
                        <a href='/queue' className={`nav-a-tag${location.pathname.includes('/queue')  ? '-active' : ''}`}>Queue</a>
                        <a href='/availability' className={`nav-a-tag${location.pathname.includes('/availability') ? '-active' : ''}`}>Availability</a>
                        <a href='/rubrics' className={`nav-a-tag${location.pathname.includes('/rubrics') ? '-active' : ''}`}>Rubrics</a>
                    </nav>
                    <div className='block md:hidden lg:hidden xl:hidden'>
                        <IconButton onClick={()=>{setToggleDrawer(true)}}>
                            <MenuIcon/>
                        </IconButton>
                        <Drawer open={toggleDrawer} onClose={()=>{setToggleDrawer(false)}}>
                        <nav className='flex flex-col gap-3 p-5' style={{backgroundColor:'rgb(243, 243, 243)', borderRadius:'15px'}}>
                            <a href='/dashboard' className={`nav-a-tag${location.pathname.includes('/dashboard')  ? '-active' : ''}`}>Home</a>
                            <a href='/queue' className={`nav-a-tag${location.pathname.includes('/queue')  ? '-active' : ''}`}>Queue</a>
                            <a href='/availability' className={`nav-a-tag${location.pathname.includes('/availability') ? '-active' : ''}`}>Availability</a>
                            <a href='/rubrics' className={`nav-a-tag${location.pathname.includes('/rubrics') ? '-active' : ''}`}>Rubrics</a>
                        </nav>
                        </Drawer>
                    </div>
                </>
                :
                <></>
            }
            
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
                    <MenuItem onClick={()=>{userContext.logout()}}>Logout</MenuItem>
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
                    <div className='flex flex-col gap-3'>
                        {notifications?.map((notification,index)=>(
                            <Notification action={handleNotificationRedirectionClick} key={index} notification={notification}/>
                        ))}
                    </div>
                </Menu>
            </div>
        </div>
    )
}

export default Navbar
