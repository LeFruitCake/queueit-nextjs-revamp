import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'
import { Button, Typography } from '@mui/material'
import { randomSeason } from '@/Utils/Utility_functions'
import { useClassroomContext } from '@/Utils/ClassroomContext'
import FacultyAvailabilityCard from './FacultyAvailabilityCard'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { Classes, dpurple, ProjectProposal, SPEAR_URL, UserRetrieved, UserType } from '@/Utils/Global_variables'
import { useUserContext } from '@/Utils/AuthContext'
import { useRouter } from 'next/navigation'
import { useTeamContext } from '@/Utils/TeamContext'
import { toast } from 'react-toastify'


const GroupDetailStudentView = () => {
    const classroomContext = useClassroomContext()
    const classroom = classroomContext.classroom
    const user = useUserContext().user
    const groupContext = useTeamContext()
    const [project, setProject] = useState<ProjectProposal | undefined>(undefined)
    const [mentor, setMentor] = useState<UserRetrieved | undefined>(undefined)

    return (
        <div className='flex flex-col h-full'>
            <div className='bg-dpurple w-full h-32 flex relative rounded-md items-center px-10'>
                <BackButton/>
                <div className='flex flex-col justify-start gap-2 flex-1 px-10'>
                    <Typography variant='h4' color='white' fontWeight='bold'>{classroom?.courseDescription}</Typography>
                    <Typography variant='h6' color='white'>{classroom?.section}</Typography>
                </div>
                <img className='hidden md:block lg:block xl:block' src={randomSeason()} alt="season" style={{height:'250%', position:'absolute', bottom:0, right:0}}/>
            </div>
            <div className='w-full flex flex-col lg:flex-row xl:flex-row flex-grow py-5 gap-5 relative'>
                <div className='flex-1'>
                    <FacultyAvailabilityCard facultyFirstname='Jasmine' facultyLastname='Tulin' facultyDesignation='Adviser'/>
                </div>
                {
                    groupContext.Team?
                    <div className='flex-1'>
                        <FacultyAvailabilityCard facultyFirstname='Jasmine' facultyLastname='Tulin' facultyDesignation='Mentor'/>
                    </div>
                    :
                    <></>
                }
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex-1 border-2 border-black bg-white rounded-lg flex flex-col justify-around p-5'>
                        <Typography variant='h5' fontWeight='bold' textAlign='center'>Groups</Typography>
                        <div className='flex flex-col w-1/2 items-center justify-center mx-auto relative'>
                            <PersonSearchIcon sx={{fontSize:'5em'}}/>
                            <Typography variant='caption' color='gray' textAlign='center'>You have yet to find any group. Connect with others.</Typography>
                        </div>
                        <Button className='w-fit self-center' sx={{backgroundColor:dpurple, color:'white', padding:'0.6em 1em'}}>Connect</Button>
                    </div>
                    <div className='flex-1 flex flex-col gap-3'>
                        <div className='flex-1 border-2 border-black bg-white rounded-lg flex flex-col justify-around p-5'>
                            <Typography variant='h5' fontWeight='bold' textAlign='center'>Consultations</Typography>
                            <div className='flex flex-col w-1/2 items-center justify-center mx-auto relative'>
                                <Typography variant='h1'>0</Typography>
                                <Typography variant='caption' color='gray' textAlign='center'>You have yet to find any group. Connect with others.</Typography>
                            </div>
                            <Button className='w-fit self-center' sx={{backgroundColor:dpurple, color:'white', padding:'0.6em 1em'}}>Connect</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupDetailStudentView