"use client"
import React, { useState } from 'react'
import star from '../../public/images/star.png'
import squiggly from '../../public/images/squiggly.png'
import floating from '../../public/images/3.png'
import { Button, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { setMinTime } from '@/Utils/Utility_functions'
import { dpurple } from '@/Utils/Global_variables'

interface LetThemInModalProps{
    setIsQueueing: Function
    setTimeStop: Function
    setQueueingLimit: Function
    setQueueingFilter: Function
}

const LetThemInModal:React.FC<LetThemInModalProps> = ({setIsQueueing, setTimeStop, setQueueingLimit, setQueueingFilter}) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const date = new Date().toDateString()
    return (
    <div className='bg-white rounded-lg border-2 border-black relative p-10'>
        
        <img style={{position:'absolute', height:'8dvw', transform:'translate(-50%,0%)', top:'10%', left:'8%'}} src={star.src} alt="star" className='absolute z-0'/>
        <img style={{position:'absolute', height:'8dvw', transform:'translate(-50%,0%)', top:'0%', right:'0%'}} src={squiggly.src} alt="squiggly" className='absolute z-0'/>
        <div className='z-1 500 flex'>
            <div className='hidden md:block lg:block xl:block'>
                <img src={floating.src} alt="floating" className='relative z-0' />
            </div>
            <div className='flex flex-col flex-grow text-center gap-3 items-center justify-center w-full'>
                <Typography style={{fontSize:'clamp(3em, 3em + 1dvw, 8em)'}}>Let Them In!</Typography>
                <Typography sx={{fontSize:'clamp(0.3em, 0.3em + 0.9dvw, 3em)'}}>Open the queue now and connect with your students who are ready and waiting!</Typography>
                <Button onClick={handleOpen} sx={{backgroundColor:'#7D57FC', color:'white', marginTop:'25px', fontSize:'clamp(1em, 1em + 1dvw, 2em)', borderRadius:'15px', padding:'1em 1.5em'}}>Open Queue</Button>
            </div>
        </div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className='bg-white absolute w-2/3 md:w-1/3 lg:w-1/3 xl:w-1/3 p-10 flex flex-col gap-3 rounded-xl' style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <div className='w-full flex-col md:flex-row lg:flex-row xl:flex-row flex justify-between items-center'>
                    <Typography fontWeight='bold'>{date}</Typography>
                    <input className='border-2 border-silver p-3 rounded-xl' type="time" name="endTime" min={setMinTime()} />
                </div>
                <div className='w-full flex flex-col md:flex-row lg:flex-row xl:flex-row justify-between items-center'>
                    <Select multiple defaultValue={[-1]} sx={{width:'100%'}} onChange={
                        (e)=>{
                          console.log(e.target.value)  
                        }
                    }>
                        <MenuItem value={-1} defaultChecked>All Classrooms</MenuItem>
                    </Select>
                </div>
                <div className='w-full flex flex-col lg:flex-row xl:flex-row'>
                    <Typography sx={{flex:1}}>Enter maximum number of groups for consultation:</Typography>
                    <input style={{flex:1}} type='number' defaultValue={0} min={0} className='border-2 border-silver p-3 rounded-xl'/>
                </div>
                <div className='w-full mt-5 flex justify-center gap-5'>
                    <Button onClick={handleClose} sx={{color:'black', padding:'1em 1.5em'}} >Cancel</Button>
                    <Button onClick={()=>{setOpen(false);setIsQueueing(true)}} sx={{backgroundColor:dpurple, color:'white', padding:'1em 3em', borderRadius:'15px'}}>Open</Button>
                </div>
            </div>
        </Modal>
    </div>
    )
}

export default LetThemInModal