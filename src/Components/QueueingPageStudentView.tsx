"use client"
import { useFacultyContext } from '@/Contexts/FacultyContext'
import { dpurple, QueueingManager, QUEUEIT_URL } from '@/Utils/Global_variables';
import { capitalizeFirstLetter, randomAvatar, randomGroupImage } from '@/Utils/Utility_functions';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import CurrentlyTending from './CurrentlyTending';
import Chat from './Chat';
import QueueingList from './QueueingList';

const QueueingPageStudentView = () => {
    const faculty = useFacultyContext().Faculty;
    const [queueingManager, setQueueingManager] = useState<QueueingManager>()

    // const fetchQueueingManagerForFaculty = ()=>{
    //     const response = fetch(`${QUEUEIT_URL}`)
    // }
    const [avatar, setAvatar] = useState<string>()
    const [currentTime, setCurrentTime] = useState<string>()
    const [groupAvatar, setGroupAvatar] = useState<string>()

    useEffect(() => {
        // Set the avatar when the component mounts
        setAvatar(randomAvatar())
        setGroupAvatar(randomGroupImage())
        // Function to get the current time
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convert to 12-hour format
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            // Set the time in the desired format
            setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm}`);
        }

        // Update time every second
        const intervalId = setInterval(updateTime, 1000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        }
    }, []);

    return (
        <div className='relative w-full h-full flex gap-3'>
            {/* left side */}
            <div className='flex flex-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 gap-3'>
                <div className='w-full h-28 bg-dpurple p-3 rounded-md relative flex'>
                    <img src={avatar} alt="avatar" style={{height:'100%'}} />
                    <Typography className='flex items-center' variant='h6' color='white' fontWeight='bold' textAlign='center'>{`${capitalizeFirstLetter(faculty?faculty.firstname:'')} ${capitalizeFirstLetter(faculty?faculty.lastname:'')}`}</Typography>
                    <Typography sx={{flex:1, justifyContent:'end', color:'white'}} className='w-full  text-end flex items-center'>Queueing ends at 3:00 PM</Typography>
                </div>
                <div className='w-full h-28 rounded-md relative flex border-2 border-black bg-white justify-between p-3 items-center'>
                    <Typography variant='h6'>Current Time</Typography>
                    <Typography variant='h3' fontWeight='bold'>{currentTime}</Typography>
                </div>
                <QueueingList teams={undefined}/>
            </div>

            {/* right side */}
            <div className='flex flex-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 gap-3'>
                <CurrentlyTending team={null}/>
                <Chat faculty={faculty}/>
            </div>
        </div>
    )
}

export default QueueingPageStudentView
