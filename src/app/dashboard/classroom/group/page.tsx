"use client"
import BackButton from '@/Components/BackButton'
import BaseComponent from '@/Components/BaseComponent'
import { useTeamContext } from '@/Contexts/TeamContext'
import { Button, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import CampaignIcon from '@mui/icons-material/Campaign';
import { lgreen, UserType } from '@/Utils/Global_variables'
import MemberProfile from '@/Components/MemberProfile'
import { sampleGroupMembers } from '@/Sample_Data/SampleData1'
import '../group/group.css'
import catLoader from '../../../../../public/loaders/catLoader-blackbg.gif'
import { capitalizeFirstLetter, randomQuotes } from '@/Utils/Utility_functions'
import mentor from '../../../../../public/images/mentor.png'
import { useUserContext } from '@/Contexts/AuthContext'
import GroupDetailAdviserView from '@/Components/ClassroomDetailFacultyView'
import GroupDetailStudentView from '@/Components/ClassroomDetailStudentView'

const page = () => {
    const user = useUserContext().user
    const team = useTeamContext().Team
    const [meetings, setMeetings] = useState(1)
    const quote = randomQuotes()
    console.log(team?.project?.adviser)
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
                            <IconButton sx={{color:'black', backgroundColor:lgreen, borderRadius:'5px', display:'flex', gap:'5px', alignSelf:'center'}}>
                                <CampaignIcon/>
                                <p style={{fontSize:'16px'}}>Meet Now</p>
                            </IconButton>
                        </div>

                        <div className='py-10'>
                            <Typography variant='h5' fontWeight='bold' color='white'>Members</Typography>
                            <div className='flex gap-2 w-full overflow-auto py-3'>
                                {/* {Array.from(team?.members).map((member, index)=>(
                                    <MemberProfile key={index} member={member}/>
                                ))} */}
                                {sampleGroupMembers.map((member, index)=>(
                                    <div key={index}>
                                        <MemberProfile  member={member}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='relative'>
                        <div className='relative z-50 px-5'>
                            <div className='bg-lgreen w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-full h-44 z-50 relative flex items-center justify-center' style={{marginTop:'-90px', justifySelf:'center'}}>
                                {team?.project?.adviser?
                                    <div className='w-full h-full p-5 flex justify-start items-center relative'>
                                        <span className='w-1/2 md:text-center lg:text-center xl:text-center1'>
                                            <Typography variant='h6' fontWeight='bold'>{`${capitalizeFirstLetter(team.project.adviser.firstname)} ${capitalizeFirstLetter(team.project.adviser.lastname)}`}</Typography>
                                            <Typography variant='subtitle2'>Mentor</Typography>
                                        </span>
                                        <img src={mentor.src} alt="mentor" style={{height:'200%', position:'absolute', right:0,bottom:0, marginBottom:'-86px', marginRight:'-50px'}} />
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
                            
                            {meetings?
                                <div>
                                    <div className='flex flex-col md:flex-row justify-between items-center'>
                                        <Typography variant='h4' color='white' fontWeight='bold'>Consultation History</Typography>
                                        <Button sx={{backgroundColor:lgreen, color:'black', fontWeight:'bold'}}>Generate Report</Button>
                                    </div>
                                </div>
                                :

                                <div style={{padding:'2em'}} className='flex items-center flex-col justify-center gap-3'>
                                    <img src={catLoader.src} alt="catLoader" style={{height:'150px'}}/>
                                    <Typography variant='subtitle2' color={lgreen}>Paw licking cat means this team has yet to conduct meetings nor consultations. </Typography>
                                </div>
                            }
                        </div>
                    </div>
                </div>
        </BaseComponent>
    )
}

export default page
