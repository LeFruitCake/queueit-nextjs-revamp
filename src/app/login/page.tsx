"use client"
import React, { useState } from 'react'
import purpleSquiggle from '../../../public/images/img2.png'
import star from '../../../public/images/star.png'
import { Button, IconButton, TextField, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function page() {
    const [passwordHidden, setPasswordHidden] = useState(false)
    return (
        <div className='h-screen relative overflow-hidden flex'>
            <img src={purpleSquiggle.src} alt="squiggle" style={{position:'absolute', transform:'translate(-30%,-18%)', top:'0%', left:'0%'}} />
            <img src={purpleSquiggle.src} alt="squiggle" style={{position:'absolute', transform:'translate(60%,18%)', bottom:'-35%', right:'30%'}} />
            <img style={{position:'absolute', height:'8dvw', transform:'translate(-50%,-50%)', top:'20%', left:'70%'}} src={star.src} alt="star" />
            <img style={{position:'absolute', height:'16dvw', transform:'translate(-50%,0%)', bottom:'-10%', left:'8%'}} src={star.src} alt="star" />
            <div className='flex-grow relative flex items-center justify-center' style={{backgroundColor:'rgba(0,0,0,0.6)'}}>
                <form className='bg-white h-fit w-1/3 rounded-xl p-10 flex flex-col items-center' style={{minWidth:'350px'}}>
                    <Typography variant='h5'>Login</Typography>
                    <div className='flex w-100 gap-3 pt-2'>
                        <Typography color='gray'>New to QueueIT?</Typography>
                        <a style={{textDecoration:'underline', fontWeight:'bold'}} href="/">Sign up for now</a>
                    </div>
                    <div className='w-full pt-2'>
                        <Typography style={{color:'gray'}}>Email address</Typography>
                        <input className='w-full p-3 rounded-lg' style={{border:'solid 1px silver'}} type="text" />
                    </div>
                    <div className='w-full pt-2'>
                        <div className='flex justify-between items-center'>
                            <Typography style={{color:'gray'}}>Password</Typography>
                            {passwordHidden?<><IconButton onClick={()=>setPasswordHidden(false)}><VisibilityOffIcon/></IconButton></>:<><IconButton onClick={()=>{setPasswordHidden(true)}}><VisibilityIcon/></IconButton></>}
                        </div>
                        <input className='w-full p-3 rounded-lg' style={{border:'solid 1px silver'}} type={passwordHidden?"text":"password"} />
                    </div>
                    <Button sx={{marginTop:'15px',backgroundColor:'#CCFC57', color:'black', borderRadius:'15px', padding:'0.5em 3em', width:'100%', fontWeight:'bold'}}>Login</Button>
                </form>
            </div>
        </div>
    )
}
