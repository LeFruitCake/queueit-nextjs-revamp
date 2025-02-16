"use client"
import { dpurple, QUEUEIT_URL } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, randomAvatar, randomSeason } from '@/Utils/Utility_functions'
import { useWebSocket } from '@/WebSocket/WebSocketContext'
import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface FacultyAvailabilityCardProps{
    facultyFirstname: string | undefined
    facultyLastname: string | undefined
    facultyDesignation: string | undefined
    facultyID: number | undefined
}

interface queueingManagerStatus{
    cateringClasses: Array<number>
    isActive: boolean
    queueSize: number
}


const FacultyAvailabilityCard:React.FC<FacultyAvailabilityCardProps> = ({facultyFirstname, facultyLastname, facultyDesignation, facultyID}) => {
    const client = useWebSocket()


    const [isFacultyActive, setIsFacultyActive] = useState<queueingManagerStatus|null>()
    const [avatar, setAvatar] = useState<string>()

    useEffect(()=>{
        const fetchFacultyStatus = async ()=>{
            fetch(`${QUEUEIT_URL}/faculty/isActive/${facultyID}`)
            .then(async(data)=>{
                switch(data.status){
                    case 200:
                        const response:queueingManagerStatus = await data.json()
                        setIsFacultyActive(response);
                        break;
                    case 404:
                        toast.error("Faculty does not exist.")
                        break;
                    default:
                        toast.error("Something went wrong while fetching Faculty active status.")
                }
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Caught an exception while fetching Faculty active status.")
            })
        }
        setAvatar(randomAvatar())
        fetchFacultyStatus()
    },[facultyID])


    useEffect(() => {
        if (client && facultyID) {
            const subscription = client.subscribe(`/topic/queueStatus/adviser/${facultyID}`, (message) => {
                const receivedMessage:queueingManagerStatus = JSON.parse(message.body);
                setIsFacultyActive(receivedMessage)
            });
    
            return () => {
                console.log('Unsubscribing');
                subscription.unsubscribe();
            };
        }
    }, [client, facultyID]);
    
    
    return (
        <div className='bg-white h-full w-full flex flex-col relative items-center justify-around border-2 border-black rounded-lg py-5'>
            <Typography variant='h6' fontWeight='bold' textAlign='center'>{facultyDesignation}</Typography>
            <div>
                <div>
                    <img src={avatar} alt="randomAvatar" className='h-40 aspect-square'/>
                </div>
                <Typography variant='h5' fontWeight='bold' textAlign='center'>{`${capitalizeFirstLetter(facultyFirstname?facultyFirstname:'')} ${capitalizeFirstLetter(facultyLastname?facultyLastname:'')}`}</Typography>
            </div>
            <div className='w-2/3 p-5 h-fit flex items-center justify-center rounded-xl border-2 border-black' style={{backgroundColor:'#E9E3FF'}}>
                {
                    isFacultyActive?.isActive?

                    <div className='gap-3 w-full flex justify-center flex-col items-center'>
                        <Typography variant='h5' fontWeight='bold' textAlign='center'>Available</Typography>
                        <Typography>{`${isFacultyActive.queueSize === 0 ? 'No one' : isFacultyActive.queueSize} ${isFacultyActive.queueSize === 0 ? '' : isFacultyActive.queueSize > 1 ? 'groups' : 'group'} in queue.`}</Typography>
                        <Button sx={{backgroundColor:dpurple, color:'white', padding:'0.5em 3em'}}>Queue</Button>
                    </div>
                    :
                    <Typography variant='h5' fontWeight='bold' textAlign='center'>Unavailable</Typography>
                }
            </div>
        </div>
    )
}

export default FacultyAvailabilityCard
