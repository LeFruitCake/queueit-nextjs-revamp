import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'
import { Button, Typography } from '@mui/material'
import { randomAvatar, randomGroupImage, randomSeason } from '@/Utils/Utility_functions'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import FacultyAvailabilityCard from './FacultyAvailabilityCard'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { dpurple, ProjectProposal, SPEAR_URL, UserRetrieved } from '@/Utils/Global_variables'
import { useUserContext } from '@/Contexts/AuthContext'
import PersonIcon from '@mui/icons-material/Person';
import { useTeamContext } from '@/Contexts/TeamContext'
import { toast } from 'react-toastify'


const GroupDetailStudentView = () => {
    const classroomContext = useClassroomContext()
    const classroom = classroomContext.classroom
    const user = useUserContext().user
    const groupContext = useTeamContext()
    const [project, setProject] = useState<ProjectProposal | undefined>(undefined)
    const [mentor, setMentor] = useState<UserRetrieved | undefined>(undefined)
    const [season, setSeason] = useState<string>()

    const fetchCurrentStudentTeam = async ()=>{
        const response = fetch(`${SPEAR_URL}/team/my/${classroom?.cid}?userId=${user?.uid}`)
                        .then(async (data)=>{
                            if(data.ok){
                                const team_data = await data.json()
                                groupContext.setTeam(team_data)
                            }else{
                                groupContext.setTeam(undefined)
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                            toast.error("Something went wrong while fetching your team.")
                        })
    }

    const fetchCurrentStudentMentor = async ()=>{
        const response = fetch(`${SPEAR_URL}/get-teacher/${project?.adviserId}`)
                        .then(async (data)=>{
                            const mentor_data = await data.json()
                            setMentor(mentor_data)
                        })
    }

    const fetchCurrentStudentProject = async ()=>{
        const response = fetch(`${SPEAR_URL}/proposals/class/${classroom?.cid}/student/${user?.uid}`)
                        .then(async (data)=>{
                            const project_data = await data.json()
                            setProject(project_data)
                        })
                        .catch((err)=>{
                            console.log(err)
                            toast.error("Something went wrong while fetching your project proposals.")
                        })
    }

    useEffect(()=>{
        fetchCurrentStudentTeam();
    },[])

    useEffect(()=>{
        if (groupContext.Team){
            fetchCurrentStudentProject()
        }
        setSeason(randomSeason())
    },[groupContext.Team])

    useEffect(()=>{
        if(project?.adviserId){
            fetchCurrentStudentMentor()
        }
    },[project])

    return (
        <div className='flex flex-col h-full'>
            <div className='bg-dpurple w-full flex relative rounded-md items-center p-10 h-40'>
                <BackButton/>
                <div className='flex flex-col justify-start gap-2 flex-1 px-10 z-10'>
                    <Typography variant='h4' color='white' fontWeight='bold'>{classroom?.courseDescription}</Typography>
                    <Typography variant='h6' color='white'>{classroom?.section}</Typography>
                </div>
                <img className='hidden md:block lg:block xl:block' src={season} alt="season" style={{height:'250%', position:'absolute', bottom:0, right:0, zIndex:0}}/>
            </div>
            <div className='w-full flex flex-col lg:flex-row xl:flex-row flex-grow py-5 gap-5 relative'>
                <div className='flex-1'>
                    <FacultyAvailabilityCard facultyID={classroom?.uid} facultyFirstname={classroom?.firstname} facultyLastname={classroom?.lastname} facultyDesignation='Adviser'/>
                </div>
                {
                    groupContext.Team && mentor?
                    <div className='flex-1'>
                        <FacultyAvailabilityCard facultyID={mentor.uid} facultyFirstname={mentor.firstname} facultyLastname={mentor.lastname} facultyDesignation='Mentor'/>
                    </div>
                    :
                    <></>
                }
                <div className='flex-1 flex flex-col gap-3'>
                    <div className='flex-1 border-2 border-black bg-white rounded-lg flex flex-col justify-around p-5'>
                        <Typography variant='h5' fontWeight='bold' textAlign='center'>{groupContext.Team?<>{groupContext.Team.groupName}</>:<>Groups</>}</Typography>
                        <div className='flex flex-col w-1/2 items-center justify-center mx-auto relative'>
                            {groupContext.Team?<img src={randomGroupImage()} alt="groupIcon" style={{height:'50%'}} />:<PersonSearchIcon sx={{fontSize:'5em'}}/>}
                            {groupContext.Team?
                                <Typography variant='h6' fontWeight='bold' textAlign='center'>{`[${groupContext.Team.projectName}]`}</Typography>
                                :
                                <Typography variant='caption' color='gray' textAlign='center'>You have yet to find any group. Connect with others.</Typography>
                            }
                        </div>
                        {groupContext.Team?
                            <div className='w-full flex gap-3 items-end justify-center'>
                                 <PersonIcon sx={{fontSize:'2em'}}/> 
                                 <Typography sx={{textDecoration:'underline', fontWeight:'bold', cursor:'pointer'}}>{`${groupContext?.Team?.memberIds?.length} ${groupContext?.Team?.memberIds?.length > 1?'Members':'Member'}`}</Typography>
                            </div>
                            :
                            <Button className='w-fit self-center' sx={{backgroundColor:dpurple, color:'white', padding:'0.6em 1em'}}>Connect</Button>
                        }
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