import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'   
import { randomAvatar, randomGroupImage, randomSeason } from '@/Utils/Utility_functions'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import FacultyAvailabilityCard from './FacultyAvailabilityCard'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { dpurple, ProjectProposal, SPEAR_URL, UserRetrieved } from '@/Utils/Global_variables'
import { useUserContext } from '@/Contexts/AuthContext'
import PersonIcon from '@mui/icons-material/Person';
import MemberProfile from '@/Components/MemberProfile'
import { useTeamContext } from '@/Contexts/TeamContext'
import { toast } from 'react-toastify' 
import { Modal, Box, Typography, Button } from '@mui/material';
 

const GroupDetailStudentView = () => {
    const classroomContext = useClassroomContext()
    const classroom = classroomContext.classroom
    const team = useTeamContext().Team
    const user = useUserContext().user
    const groupContext = useTeamContext()
    const [project, setProject] = useState<ProjectProposal | undefined>(undefined)
    const [mentor, setMentor] = useState<UserRetrieved | undefined>(undefined)
    const [season, setSeason] = useState<string>() 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    const fetchCurrentStudentTeam = async ()=>{
        fetch(`${SPEAR_URL}/team/myTeam/${classroom?.cid}/${user?.uid}`)
            .then(async (data)=>{
                // console.log(data)
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
        fetch(`${SPEAR_URL}/get-teacher/${groupContext.Team?.adviserId}`)
            .then(async (data)=>{
                const mentor_data = await data.json()
                setMentor(mentor_data)
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    const fetchCurrentStudentProject = async ()=>{
        fetch(`${SPEAR_URL}/proposals/class/${classroom?.cid}/student/${user?.uid}`)
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
        if(groupContext.Team?.adviserId){
            fetchCurrentStudentMentor()
        }
    },[groupContext.Team])
 

    return (
        <>
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
                        <div onClick={handleOpenModal} className='flex-1 border-2 border-black bg-white rounded-lg flex flex-col justify-around p-5  '>
                            <Typography variant='h5' fontWeight='bold' textAlign='center'>{groupContext.Team?<>Team {groupContext.Team.groupName}</>:<>Groups</>}</Typography>
                            <div className='flex flex-col w-1/2 items-center justify-center mx-auto relative'>
                                {groupContext.Team?<img src={randomGroupImage()} alt="groupIcon" style={{height:'50%'}} />:<PersonSearchIcon sx={{fontSize:'5em'}}/>}
                                {groupContext.Team?
                                    // <Typography variant='h6' fontWeight='bold' textAlign='center'>{`[${groupContext.Team.projectName}]`}</Typography>
                                    <></>
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

            <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
                onClick={handleCloseModal} // This ensures clicks outside the modal close it
                className="flex items-center justify-center h-screen"
            >
                
                <Box
                    onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
                    className="flex flex-col items-center justify-center px-10 py-5 bg-white shadow-lg rounded-lg"
                >
                    <Typography textAlign="center" variant="h3" fontWeight="bold" color="black">
                        Members
                    </Typography> 
                    <div className="flex gap-3 min-w-max mt-4">
                        {team?.memberIds?.length > 0 ? (
                            team.memberIds.map((member, index) => (
                                <div key={index}>
                                    <MemberProfile memberID={member} />
                                </div>
                            ))
                        ) : (
                            <Typography textAlign="center" color="gray">No members available</Typography>
                        )}
                    </div> 
                </Box>
            </Box>
        </Modal>


  
        </>
        
    )
}

export default GroupDetailStudentView