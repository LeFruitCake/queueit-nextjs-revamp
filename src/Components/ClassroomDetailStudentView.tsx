import React, { useEffect, useRef, useState } from 'react'
import BackButton from './BackButton'   
import { randomAvatar, randomGroupImage, randomSeason } from '@/Utils/Utility_functions'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import FacultyAvailabilityCard from './FacultyAvailabilityCard'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; 
import { Attendance, AttendanceStatus, lgreen, MeetingStatus, QUEUEIT_URL, SPEAR_URL, User, UserRetrieved, UserType, dpurple, ProjectProposal } from '@/Utils/Global_variables'
import { useUserContext } from '@/Contexts/AuthContext'
import PersonIcon from '@mui/icons-material/Person';
import MemberProfile from '@/Components/MemberProfile'
import { useTeamContext } from '@/Contexts/TeamContext'
import { toast } from 'react-toastify' 
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useMeetingsContext } from '@/Contexts/MeetingsContext'
import { useRouter } from 'next/navigation'
import { capitalizeFirstLetter, randomAvatar, randomQuotes } from '@/Utils/Utility_functions' 
import CatLoader from '@/Components/CatLoader'
import catLoader from '../../public/loaders/catloader.gif'

const GroupDetailStudentView = () => {
    const classroomContext = useClassroomContext()
    const classroom = classroomContext.classroom
    const team = useTeamContext().Team
    const user = useUserContext().user
    const groupContext = useTeamContext()
    const {Meetings,setMeetings} = useMeetingsContext();
    const groupAvatar = useRef<string>(randomGroupImage())
    const [project, setProject] = useState<ProjectProposal | undefined>(undefined)
    const [mentor, setMentor] = useState<UserRetrieved | undefined>(undefined)
    const [season, setSeason] = useState<string>() 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalConsultationOpen, setIsModalConsultationOpen] = useState(false);
    const router = useRouter();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handelOpenConsultationModal = () => {
        setIsModalConsultationOpen(true);
    };

    const handleCloseConsultationModal = () => {
        setIsModalConsultationOpen(false);
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
                                {groupContext.Team?<img src={groupAvatar.current} alt="groupIcon" style={{height:'50%'}} />:<PersonSearchIcon sx={{fontSize:'5em'}}/>}
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
                            <div onClick={handelOpenConsultationModal} className='flex-1 border-2 border-black bg-white rounded-lg flex flex-col justify-around p-5'>
                                <Typography variant='h5' fontWeight='bold' textAlign='center'>Consultations</Typography>
                                <div className='flex flex-col w-1/2 items-center justify-center mx-auto relative'>
                                    <Typography variant='h1'>{Meetings?.length || 0}</Typography>
                                    <Typography variant='caption' color='gray' textAlign='center'>
                                        {Meetings?.length ? "Total consultations conducted." : "You have yet to find any group. Connect with others."}
                                    </Typography>
                                </div>
                                <Button 
                                    className='w-fit self-center' 
                                    sx={{ backgroundColor: dpurple, color: 'white', padding: '0.6em 1em' }}
                                >
                                    {Meetings?.length > 0 ? "View" : "Connect"}
                                </Button>
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

            <Modal open={isModalConsultationOpen} onClose={handleCloseConsultationModal} sx={{
                display: "flex",
                justifyContent: "center", 
            }}>
                <Box sx={{
                    width: "60vw",  
                    maxHeight: "80vh",  
                    bgcolor: "black",  
                    p: 3,  
                    borderRadius: 2,  
                    position: "absolute",
                    marginTop: "100px", 
                    boxShadow: 24,
                    overflowY: "auto", 

                }}>
                <div className='bg-black w-100 p-5'>        
                    {Meetings?.length?
                        <div className='flex flex-col gap-6'>
                            <div className='flex justify-between items-center'>
                                <Typography variant='h3' fontWeight={"bold"} color='white'>Meeting History</Typography>
                                <IconButton onClick={()=>{router.push("/dashboard/classroom/group/summary")}} sx={{color:'black', backgroundColor:lgreen, borderRadius:'5px', display:'flex', gap:'5px', alignSelf:'center', '&:hover':{backgroundColor:'yellowgreen'}, textTransform:'none'}}><AssessmentIcon fontSize='small'/><p style={{fontSize:'16px'}}>Generate Summary</p></IconButton>
                            </div>
                            <div className='flex flex-col gap-12'>
                                {Meetings.map((historyEntry,index)=>(
                                    historyEntry.meetingStatus === MeetingStatus.ATTENDED_QUEUEING_CONDUCTED || historyEntry.meetingStatus === MeetingStatus.ATTENDED_FACULTY_CONDUCTED?
                                    <div key={index} style={{backgroundColor:'#1D1D1C'}} className='p-10 flex flex-col gap-3 rounded-md'>
                                        <Typography color={lgreen} variant='h4' fontWeight={"bold"}>{`Meeting #${index + 1}`}</Typography>
                                        <Typography variant='h6' color='gray'>{new Date(historyEntry?.start).toDateString()}</Typography>
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
                                    :
                                    <div key={index} style={{backgroundColor:'#1D1D1C'}} className='p-10 flex justify-between items-center rounded-md'>
                                        <div>
                                            <Typography color={lgreen} variant='h4' fontWeight={"bold"}>{`Meeting #${index + 1}`}</Typography>
                                            <Typography variant='h6' color='gray'>{new Date(historyEntry?.start).toDateString()}</Typography>
                                        </div>
                                        <div>
                                            {historyEntry.meetingStatus === MeetingStatus.CANCELLED?
                                                <Typography variant='h6' color='error' fontWeight={"bold"}>Mentor cancelled the appointment.</Typography>
                                                :historyEntry.meetingStatus === MeetingStatus.FAILED_DEFAULTED?
                                                    <Typography variant='h6' color='error' fontWeight={"bold"}>Both parties did not show up on the agreed schedule.</Typography>
                                                    :historyEntry.meetingStatus === MeetingStatus.FAILED_FACULTY_NO_SHOW?
                                                        <Typography variant='h6' color='error' fontWeight={"bold"}>Mentor did not show up on the agreed schedule.</Typography>
                                                        :historyEntry.meetingStatus === MeetingStatus.FAILED_TEAM_NO_SHOW?
                                                            <Typography variant='h6' color='error' fontWeight={"bold"}>Team did not show up on the agreed schedule.</Typography>
                                                            :historyEntry.meetingStatus === MeetingStatus.SET_AUTOMATED?
                                                                <Typography variant='h6' color='primary' fontWeight={"bold"}>System automated meeting is expected.</Typography>
                                                                :historyEntry.meetingStatus === MeetingStatus.SET_MANUALLY?
                                                                    <Typography variant='h6' color='primary' fontWeight={"bold"}>Mentor created an appointment for {new Date(historyEntry.end).toDateString()}.</Typography>
                                                                    :
                                                                    <Typography variant='h6' color='success' fontWeight={"bold"}>Ongoing</Typography>
                                            }
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
                </Box> 
            </Modal>

            
        </>
        
    )
}

export default GroupDetailStudentView