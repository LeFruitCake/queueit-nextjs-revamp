"use client"
import { useUserContext } from '@/Contexts/AuthContext'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import { useFacultyContext } from '@/Contexts/FacultyContext'
import { useQueueingManagerContext } from '@/Contexts/QueueingManagerContext'
import { useTeamContext } from '@/Contexts/TeamContext'
import { dpurple, Faculty, QueueingManager, QUEUEIT_URL, UserType } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, randomAvatar, randomSeason } from '@/Utils/Utility_functions'
import { useWebSocket } from '@/WebSocket/WebSocketContext'
import { Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

interface FacultyAvailabilityCardProps{
    facultyFirstname: string | undefined
    facultyLastname: string | undefined
    facultyDesignation: string | undefined
    facultyID: number | undefined
}


const FacultyAvailabilityCard:React.FC<FacultyAvailabilityCardProps> = ({facultyFirstname, facultyLastname, facultyDesignation, facultyID}) => {
    const client = useWebSocket()
    const [queueingManager, setQueueingManager] = useState<QueueingManager>()
    const setLocalStorageQueueingManager = useQueueingManagerContext().setQueueingManager
    const avatar = useRef<string>(randomAvatar())
    const facultyContext = useFacultyContext()
    const team = useTeamContext().Team
    const classroom = useClassroomContext().classroom
    const router = useRouter();
    const user = useUserContext().user

    useEffect(()=>{
        if(!queueingManager){
            fetch(`${QUEUEIT_URL}/faculty/getQueueingManager/${facultyID}`)
            .then(async(data)=>{
                switch(data.status){
                    case 200:
                        const response:QueueingManager = await data.json()
                        // console.log(response)
                        setQueueingManager(response);
                        break;
                    default:
                        console.log(data)
                        // toast.error("Something went wrong while fetching Faculty active status.")
                }
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Caught an exception while fetching Faculty active status.")
            })
        }
    },[queueingManager])

    useEffect(()=>{
        if(facultyID){
            const fetchFacultyStatus = async ()=>{
                fetch(`${QUEUEIT_URL}/faculty/getQueueingManager/${facultyID}`)
                .then(async(data)=>{
                    switch(data.status){
                        case 200:
                            const response:QueueingManager = await data.json()
                            setQueueingManager(response);
                            break;
                        case 404:
                            console.log(`Faculty member ${`${facultyFirstname} ${facultyLastname}`} does not exist.`)
                            // toast.error("Faculty does not exist.")
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
            fetchFacultyStatus()
        }
    },[facultyID])


    useEffect(() => {
        if (client && facultyID) {
            const facultyStatusSubscription = client.subscribe(`/topic/facultyActivity/adviser/${facultyID}`, (message) => {
                const receivedMessage:QueueingManager = JSON.parse(message.body);
                // console.log(receivedMessage)
                setQueueingManager(receivedMessage)
                setLocalStorageQueueingManager(receivedMessage)
            });

            const queueingStatusSubscription = client.subscribe(`/topic/queueStatus/adviser/${facultyID}`, (message) => {
                        const receivedMessage = JSON.parse(message.body);
                        // console.log(`Received from websocket! ${receivedMessage}`)
                        // (console.log(receivedMessage))
                        if(receivedMessage === true){
                          fetch(`${QUEUEIT_URL}/faculty/getQueueingManager/${facultyID}`)
                          .then(async(data)=>{
                              switch(data.status){
                                  case 200:
                                      const response:QueueingManager = await data.json()
                                      console.log(response)
                                      setQueueingManager(response);
                                      setLocalStorageQueueingManager(response)
                                      break;
                                  default:
                                      toast.error("Something went wrong while fetching Faculty active status.")
                              }
                          })
                          .catch((err)=>{
                              console.log(err)
                              toast.error("Caught an exception while fetching Faculty active status.")
                          })
                        }else{
                          setQueueingManager((prev:QueueingManager) => ({
                            ...prev, // Spread the previous state
                            queueingEntries: receivedMessage // Update the queueingEntries with the new data
                          }))
                        }
                    });
    
            return () => {
                console.log('Unsubscribing');
                facultyStatusSubscription.unsubscribe();
                queueingStatusSubscription.unsubscribe();
            };
        }
    }, [client, facultyID]);
    
    const handleClickQueueButton = ()=>{
        const faculty:Faculty = {
            "firstname":facultyFirstname,
            "lastname":facultyLastname,
            "uid":facultyID
        }
        facultyContext.setFaculty(faculty);
        router.push("/queue")
    }
    
    return (
        <div className='bg-white h-full w-full flex flex-col relative items-center justify-around border-2 border-black rounded-lg py-5'>
            <Typography variant='h6' fontWeight='bold' textAlign='center'>{facultyDesignation}</Typography>
            <div>
                <div>
                    <img src={avatar.current} alt="randomAvatar" className='h-40 aspect-square'/>
                </div>
                <Typography variant='h5' fontWeight='bold' textAlign='center'>{`${capitalizeFirstLetter(facultyFirstname?facultyFirstname:'')} ${capitalizeFirstLetter(facultyLastname?facultyLastname:'')}`}</Typography>
            </div>
            <div className='w-2/3 p-5 h-fit flex items-center justify-center rounded-xl border-2 border-black' style={{backgroundColor:'#E9E3FF'}}>
                {
                    queueingManager?.isActive?

                    <div className='gap-3 w-full flex justify-center flex-col items-center'>
                        <Typography variant='h5' fontWeight='bold' textAlign='center' color='success'>Available</Typography>
                        <Typography>{`${queueingManager.queueLength === 0 ? 'No one' : queueingManager.queueLength} ${queueingManager.queueLength === 0 ? '' : queueingManager.queueLength > 1 ? 'groups' : 'group'} in queue.`}</Typography>
                        {
                            queueingManager?.cateredClassrooms?.some(e => e.classroomID === classroom?.cid) || queueingManager?.cateredClassrooms?.length == 0?
                            <Button disabled={team?false:true} sx={{backgroundColor:dpurple, color:'white', padding:'0.5em 3em'}} onClick={()=>{handleClickQueueButton()}}>Queue</Button>
                            :
                            <Typography variant='caption' fontWeight='bold' color='error' textAlign='center'>{`${capitalizeFirstLetter(facultyFirstname?facultyFirstname:'')} is not expecting any students from this class right now.`}</Typography>
                        }
                    </div>
                    :
                    <Typography variant='h5' fontWeight='bold' textAlign='center' color='error'>Unavailable</Typography>
                }
            </div>
        </div>
    )
}

export default FacultyAvailabilityCard
