"use client"
import BackButton from '@/Components/BackButton'
import BaseComponent from '@/Components/BaseComponent'
import { useTeamContext } from '@/Contexts/TeamContext'
import { Button, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign';
import { AttendanceStatus, lgreen, QUEUEIT_URL, SPEAR_URL, User, UserType } from '@/Utils/Global_variables'
import MemberProfile from '@/Components/MemberProfile'
import '../group/group.css'
import { capitalizeFirstLetter, randomAvatar, randomQuotes } from '@/Utils/Utility_functions'
import mentorImage from '../../../../../public/images/mentor.png'
import { useUserContext } from '@/Contexts/AuthContext'
import { toast } from 'react-toastify'
import { useMeetingsContext } from '@/Contexts/MeetingsContext'
import catLoader from '../../../../../public/loaders/catloader.gif'
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useRouter } from 'next/navigation'

const page = () => {
    const user = useUserContext().user
    const team = useTeamContext().Team
    const [mentorAvatar, setMentorAvatar] = useState<string>()
    // const [meetings, setMeetings] = useState(1)
    const quote = randomQuotes()
    const [mentor, setMentor] = useState<User>()
    const {Meetings,setMeetings} = useMeetingsContext();
    const router = useRouter();

    useEffect(()=>{
        if(team?.adviserId){
            fetch(`${SPEAR_URL}/get-teacher/${team.adviserId}`,{
                method:"GET",
                headers:{
                    'Authorization': `Bearer ${user?.token}`
                }
            })
            .then(async(res)=>{
                switch(res.status){
                    case 200:
                        const response = await res.json()
                        setMentor(response)
                        setMentorAvatar(randomAvatar())
                        break;
                    case 404:
                        toast.error(`Faculty with ID: ${team.adviserId} not found.`)
                        break;
                    default:
                        console.log(res)
                        toast.error("Server error.");
                }
            })
            .catch((err)=>{
                console.log(err);
                toast.error("Caught an exception while fetching student details.")
            })
        }
    },[team])

    useEffect(()=>{
        if(team){
            fetch(`${QUEUEIT_URL}/meeting/teamMeetings/${team.tid}`)
            .then(async(res)=>{
                if(res.ok){
                    const response = await res.json();
                    console.log(response)
                    setMeetings(response)
                }else{
                    toast.error("Something went wrong while fetching meeting history.")
                }
            })
            .catch((err)=>{
                toast.error("Failed, caught an exception.")
                console.log(err)
            })
        }
    },[])

    return (
        <BaseComponent>
            <div className='flex-grow relative pb-5 rounded-xl bg-black mt-5'>
                    <div className='bg-dpurple flex flex-col p-5 pb-32 z-20 relative' style={{borderTopLeftRadius:'10px', borderTopRightRadius:'10px', borderBottomLeftRadius:'80px', borderBottomRightRadius:'80px'}}>
                        <div className='flex flex-col lg:flex-row xl:flex-row gap-10 justify-between items-start'>
                            <BackButton/>
                            <div className=' flex-1 flex flex-col self-center'>
                                <Typography variant='h4' color='white' fontWeight='bold'>{team?.groupName}</Typography>
                                <div className='text-white flex items-end gap-1'>
                                    <Typography variant='caption'>Consultation Schedule:</Typography>
                                    <Typography variant='subtitle2' fontWeight='bold'>11:00 AM - 12:00 PM</Typography>
                                </div>
                            </div>
                            <IconButton sx={{color:'black', backgroundColor:lgreen, borderRadius:'5px', display:'flex', gap:'5px', alignSelf:'center', '&:hover':{backgroundColor:'yellowgreen'}}} >
                                <CampaignIcon/>
                                <p style={{fontSize:'16px'}}>Meet Now</p>
                            </IconButton>
                        </div>

                        <div className='py-10'>
                            <Typography textAlign={"center"} variant='h5' fontWeight='bold' color='white'>Members</Typography>
                            <div className='flex justify-center gap-3 w-full overflow-auto py-3'>
                                {team?.memberIds.map((member, index)=>(
                                    <div key={index}>
                                        <MemberProfile  memberID={member}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='relative'>
                        <div className='relative z-50 px-5'>
                            <div className='bg-lgreen w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-full h-44 z-50 relative flex items-center justify-center' style={{marginTop:'-90px', justifySelf:'center'}}>
                                {mentor?
                                    <div className='w-full h-full p-5 flex justify-start items-center relative'>
                                        <span className='w-1/2 md:text-center lg:text-center xl:text-center1'>
                                            <Typography variant='h6' fontWeight='bold'>{`${capitalizeFirstLetter(mentor.firstname)} ${capitalizeFirstLetter(mentor.lastname)}`}</Typography>
                                            <Typography variant='subtitle2'>Mentor</Typography>
                                        </span>
                                        <img src={mentorImage.src} alt="mentor" style={{height:'200%', position:'absolute', right:0,bottom:0, marginBottom:'-86px', marginRight:'-50px'}} />
                                    </div>
                                    
                                    :
                                    <div className='flex flex-col gap-3 p-5 text-center'>
                                        <Typography variant='h6'>{`"${quote.quote}"`}</Typography>
                                        <Typography variant='caption' fontWeight='bold'>{`-${quote.author}`}</Typography>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='h-24 z-10 bg-black absolute w-full' style={{marginTop:'-90px'}}>
                            
                        </div>
                        <div className='bg-black w-full relative pt-10 p-5'>
                            
                            {Meetings?.length?
                                <div className='flex flex-col gap-6'>
                                    <div className='flex justify-between items-center'>
                                        <Typography variant='h3' fontWeight={"bold"} color='white'>Meeting History</Typography>
                                        <IconButton onClick={()=>{router.push("/dashboard/classroom/group/summary")}} sx={{color:'black', backgroundColor:lgreen, borderRadius:'5px', display:'flex', gap:'5px', alignSelf:'center', '&:hover':{backgroundColor:'yellowgreen'}, textTransform:'none'}}><AssessmentIcon fontSize='small'/><p style={{fontSize:'16px'}}>Generate Summary</p></IconButton>
                                    </div>
                                    <div className='flex flex-col gap-12'>
                                        {Meetings.map((historyEntry,index)=>(
                                            <div key={index} style={{backgroundColor:'#1D1D1C'}} className='p-10 flex flex-col gap-3 rounded-md'>
                                                <Typography color={lgreen} variant='h4' fontWeight={"bold"}>{`Meeting #${index + 1}`}</Typography>
                                                <Typography variant='subtitle2' color='gray'>{new Date(historyEntry?.start).toDateString()}</Typography>
                                                <div className='flex gap-3'>
                                                    {historyEntry?.attendanceList.map((attendanceEntry,index)=>(
                                                        <div key={index} className={`${attendanceEntry.attendanceStatus == AttendanceStatus.ABSENT?'bg-notlushred':attendanceEntry.attendanceStatus == AttendanceStatus.LATE?'bg-notlushorange':'bg-notlushgreen'} rounded-md px-3 py-2`}>
                                                            <Typography>{`${capitalizeFirstLetter(attendanceEntry.lastname)}, ${capitalizeFirstLetter(attendanceEntry.firstname)} `}</Typography>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className='flex flex-col gap-3'>
                                                    <Typography color='white' variant='h6' fontWeight={"bold"}>What will you do?</Typography>
                                                    <div className='w-full p-3 border-2 border-white max-h-48 overflow-auto' style={{backgroundColor:'black', color:'white'}}>
                                                        <Typography variant='subtitle2' sx={{lineHeight:'2.5em'}}>{historyEntry?.notedAssignedTasks || 'None recorded for this meeting session'}</Typography>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col gap-3'>
                                                    <Typography color='white' variant='h6' fontWeight={"bold"}>Are there any impediments?</Typography>
                                                    <div className='w-full p-3 border-2 border-white max-h-48 overflow-auto' style={{backgroundColor:'black', color:'white'}}>
                                                        <Typography variant='subtitle2' sx={{lineHeight:'2.5em'}}>{historyEntry?.impedimentsEncountered || 'No impediments recorded'}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                               : 
                                <div style={{padding:'2em'}} className='flex items-center flex-col justify-center gap-3'>
                                    <img src={catLoader.src} alt="catLoader" style={{height:'150px'}} />
                                    <Typography variant='subtitle2' color={lgreen}>The cat guardian has spawned. Guess this team has yet to conduct any meetings. </Typography>
                                 </div> 
                            }
                        </div>
                    </div>
                </div>
        </BaseComponent>
    )
}

export default page
