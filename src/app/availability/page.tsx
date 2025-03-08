"use client";
import BaseComponent from '@/Components/BaseComponent';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CampaignIcon from '@mui/icons-material/Campaign';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import './fullCalendarStyles.css';   
import { useUserContext } from '@/Contexts/AuthContext';
import { toast } from 'react-toastify';
import { Attendance, AttendanceDTO, AttendanceStatus, MeetingStatus, QUEUEIT_URL, SPEAR_URL, Team, UserType } from '@/Utils/Global_variables';


const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
};

const buttonStyles = {
    borderRadius: '10px',
    flex: 0.2,
    transition: 'background-color 0.3s',
    textTransform: 'none',
};

const cancelButtonStyles = {
    ...buttonStyles,
    backgroundColor: 'white',
    color: 'black',
    marginRight: '10px',
    '&:hover': {
        backgroundColor: '#5a0c9d',
        color: 'white',
    },
};

const confirmButtonStyles = {
    ...buttonStyles,
    backgroundColor: '#7d57fc',
    color: 'white',
    '&:hover': {
        backgroundColor: '#5a0c9d',
    },
};

interface CalendarEvent {
    meetingID: number
    start: Date
    end: Date
    meetingStatus: MeetingStatus
    groupName: string;
}

interface ManualAppointmentSetting{
    teamID: number
    teamName: string
    start: Date
    end: Date
    attendanceList: Array<Attendance>
    mentorID: number
}



export default function Page() {
    const userContext = useUserContext();
    const user = userContext.user;

    const [open, setOpen] = useState(false);
    const [meetingPackage, setMeetingPackage] = useState<ManualAppointmentSetting>();
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);
 
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);

    
    const [groupNames, setGroupNames] = useState<Array<string>>([])
    const [teams, setTeams] = useState<Array<Team>>([]);
    const handleGroupNameInputChange = (groupName:string)=>{
        const team = teams.find((team)=>team.groupName == groupName)
        let attendanceList:Array<Attendance> = []
        team?.memberNames.map((fullname)=>{
            const [firstname, lastname] = fullname.split(" ")
            const attendance:Attendance = {
                "firstname":firstname,
                "lastname":lastname,
                "studentEmail":`${firstname}.${lastname}@cit.edu`,
                attendanceStatus:AttendanceStatus.PRESENT
            }
            attendanceList.push(attendance);
        })
        setMeetingPackage((prev)=>({
            ...prev,
            "teamName":groupName,
            "teamID": team?.tid,
            "attendanceList":attendanceList,
            "mentorID":user?.uid,
        }))
    }
    useEffect(()=>{
        if(user?.role === UserType.FACULTY){
            fetch(`${SPEAR_URL}/team/mentored/${user.uid}`)
            .then(async(res)=>{
                if(res.ok){
                    const response:Array<Team> = await res.json();
                    response.map((team)=>{
                        setGroupNames((prev)=>[...prev, team.groupName])
                        setTeams(response)
                    })
                }else{
                    toast.error("Server error while fetching your mentees.")
                }
            })
            .catch((err)=>{
                console.log(err);
                toast.error("Caught an exception while fetching your mentees.")
            })
        }
    },[user])

    useEffect(() => { 
        fetch(`${QUEUEIT_URL}/meeting/teamMeetings/facultyAppointments/${user?.uid}`)
        .then(async(res)=>{
            if(res.ok){
                
                const response = await res.json();
                console.log(response)
                setAppointments(response)
            }else{
                toast.error("Server error while fetching appointments")
            }
        })
        .catch((err)=>{
            console.log(err)
            toast.error("Caught an exception while fetching appointments.")
        })
    }, [user]);

    const formatDateForInput = (date) => {
        // Convert the date to the required format: yyyy-MM-ddTHH:mm
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleDateSelect = (selectInfo: any) => {
        if(new Date() > selectInfo.start){
            toast.error("Please refrain from selecting past times.")
        }else{
            const formattedStart = formatDateForInput(selectInfo.start)
            const formattedEnd = formatDateForInput(selectInfo.end)
            setMeetingPackage((prev)=>({
                ...prev,
                "start":formattedStart,
                "end":formattedEnd
            }))
            setOpen(true)
        }
    };

    const handleClose = () => {
        setOpen(false);
        setErrorMessage('');
    };

    const handleSubmit = () => {
        console.log(meetingPackage)
        if(isFormValid()){
            fetch(`${QUEUEIT_URL}/meeting/teamMeetings/createAppointment`,{
                method:'POST',
                body:JSON.stringify(meetingPackage),
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(async(res)=>{

                switch(res.status){
                    case 200:
                        const response = await res.json();
                        setAppointments((prev)=>[...prev,response])
                        setSuccessMessage('Session Created Successfully');
                        setSuccessModalOpen(true);
                        break;
                    case 400:
                        toast.error(await res.text());
                        break;
                    default:
                        toast.error("Server error.")
                }
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Something went wrong.")
            })
            .finally(()=>{
                handleClose();
            })
        }
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    const handleEventClick = (eventInfo: any) => { 
        console.log("Event Info:", eventInfo);
 
        const selectedEvent:CalendarEvent = {
            meetingID:eventInfo.event._def.extendedProps.meetingID,
            start: eventInfo.event.start,
            end: eventInfo.event.end,
            meetingStatus: eventInfo.event._def.extendedProps.meetingStatus,
            groupName: eventInfo.event._def.extendedProps.teamName,
        };

        console.log("Selected Event:", selectedEvent); 
        setSelectedEvent(selectedEvent);
        setEventDetailsModalOpen(true);
    };

    const handleCancelSession = () => {
        if (selectedEvent) { 
            fetch(`${QUEUEIT_URL}/meeting/teamMeetings/facultyAppointments/cancel/${selectedEvent.meetingID}`,{
                method:'POST'
            })
            .then(async(res)=>{
                switch(res.status){
                    case 200:
                        setAppointments((prev)=>
                            prev.filter((meeting)=>meeting.meetingID != selectedEvent.meetingID)
                        )
                        setConfirmationOpen(false);
                        setSuccessMessage('Session Cancelled Successfully');
                        setEventDetailsModalOpen(false);
                        setSuccessModalOpen(true);
                        break;
                    case 400:
                        const response = await res.text()
                        toast.error(response);
                        break;
                    default:
                        toast.error("Server error");
                }
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Caught an exception while cancelling appointment.");
            })
            
        }
    };

    const isFormValid = () => {
        // Check if meetingPackage is defined
        if (!meetingPackage) {
            return false;
        }
    
        // Check if all required fields are defined and not empty
        const { teamID, teamName, start, end, attendanceList } = meetingPackage;
    
        return (
            teamID !== undefined &&
            teamName !== undefined && teamName.trim() !== '' &&
            start !== undefined &&
            end !== undefined &&
            Array.isArray(attendanceList) && attendanceList.length > 0
        );
    };

    return (
        <div className='h-screen overflow-auto'>
            <BaseComponent>
                <div className='border-2 border-black mt-5 rounded-xl bg-white p-10 md:p-6 sm:p-4 w-full max-h-[80vh] overflow-auto relative'>
                    <Typography className="text-center text-2xl md:text-xl sm:text-lg" variant='h5' fontWeight='bold' style={{ textAlign: 'center' }}>
                        Your Calendar Schedule
                    </Typography>
                    <div className="mx-auto overflow-x-auto" style={{ width: '95%' }} >
                        
                        <FullCalendar
                            allDaySlot={false}
                            selectOverlap={false}
                            slotMinTime='08:00:00'
                            slotMaxTime='18:00:00'
                            height="70vh"
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            selectable={true}
                            select={handleDateSelect}
                            events={appointments}
                            hiddenDays={[0]}
                            validRange={{
                                start: new Date()
                            }}
                            headerToolbar={{
                                start: 'timeGridWeek,timeGridDay',
                                center: 'title',
                                right: 'prev,next'
                            }}
                            eventContent={(eventInfo) => {
                                console.log(eventInfo)
                                const startTime = eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const endTime = eventInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 
                                const sessionType = eventInfo.event._def.extendedProps.sessionType;
                                const groupName = eventInfo.event._def.extendedProps.teamName;
 
                                const displayTitle = sessionType === "Consultation"
                                    ? `Consultation Session with ${groupName}`
                                    : `Presentation Session with ${groupName}`;

                                return (
                                    <div style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', color: eventInfo.event._def.extendedProps.meetingStatus === MeetingStatus.SET_MANUALLY ? '#fff':'#000' , backgroundColor: eventInfo.event._def.extendedProps.type === "upcomingEvent" ? eventInfo.backgroundColor : '#7d57fc', width: '100%', height:'100%' }}>
                                        {startTime} - {endTime} <br />
                                        <strong>{displayTitle}</strong>
                                    </div>
                                );
                            }}
                            eventClick={handleEventClick}
                        />
                    </div>
                </div>
            </BaseComponent>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    <Typography
                        variant="h6"
                        component="h2"
                        style={{
                            backgroundColor: '#7d57fc',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '25px',
                            borderRadius: '10px 10px 0 0',
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        Set Consultation or Presentation Session
                    </Typography>
                    <div style={{ padding: '3% 10% 10% 10%' }}>
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                            <Typography variant="body1" style={{ textAlign: 'left' }}>
                                Start Time:
                            </Typography>
                            <TextField
                                type="datetime-local"
                                disabled
                                value={meetingPackage?.start}
                                margin="normal"
                                required
                            />
                        </div>
                        {errorMessage && (
                            <Typography variant="body1" style={{ color: 'red', marginBottom: '10px' }}>
                                {errorMessage}
                            </Typography>
                        )}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                            <Typography variant="body1" style={{ textAlign: 'left' }}>
                                End Time:
                            </Typography>
                            <TextField
                                type="datetime-local"
                                disabled
                                value={meetingPackage?.end}
                                margin="normal"
                                required
                            />
                        </div>
                        <Stack spacing={2} >
                            <Autocomplete
                                freeSolo
                                options={groupNames}
                                onInputChange={(event, newInputValue) => {
                                    handleGroupNameInputChange(newInputValue);
                                    // setGroupName(newInputValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Enter Group Name"
                                        margin="normal"
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25%' }}>
                            <Button 
                                onClick={handleClose}
                                sx={cancelButtonStyles}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                style={{
                                    backgroundColor: isFormValid() ? '#7d57fc' : 'rgb(222, 213, 252)',
                                    color: 'white',
                                    borderRadius: '10px',
                                    flex: 0.2,
                                    transition: 'background-color 0.3s',
                                    textTransform: 'none',

                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = isFormValid() ? '#5a0c9d' : 'rgb(222, 213, 252)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isFormValid() ? '#7d57fc' : 'rgb(222, 213, 252)';
                                }}
                                disabled={!isFormValid()}
                            >
                                Set
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
 
            <Modal open={eventDetailsModalOpen} onClose={() => setEventDetailsModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',  
                            justifyContent: 'space-between',  
                            backgroundColor: '#7d57fc',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '10px 10px 0 0',
                            padding: '25px', 
                            width: '100%',
                        }}
                    >
                        <Typography
                            variant="h6"
                            component="h2"
                            style={{
                                textAlign: 'left',
                                fontWeight: 'bold',
                            }}
                        >
                            Details
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => alert('Meeting Started!')} 
                            style={{
                                backgroundColor: '#CCFC57',
                                color: 'black',
                                borderRadius: '5px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: 'black',
                                transition: 'background-color 0.3s',
                                textTransform: 'none',
                            }}
                        >
                            <CampaignIcon style={{ marginRight: '8px' }} />
                            Meet Now
                        </Button>
                    </Box>
                    {selectedEvent && (
                        <div style={{ padding: '3% 10% 10% 10%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Typography variant="body1">Group Name: </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>{selectedEvent.groupName}</Typography>
                            </div><hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Typography variant="body1">Date: </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {selectedEvent.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </Typography>
                            </div><hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Typography variant="body1">Start Time: </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </div><hr />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <Typography variant="body1">End Time: </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'right', marginTop: '25%' }}>

                                <Button
                                    variant="outlined"
                                    onClick={() => setConfirmationOpen(true)}
                                    style={{
                                        backgroundColor: '#7D57FC',
                                        color: 'white',
                                        borderRadius: '5px',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderColor: 'black',
                                        transition: 'background-color 0.3s',
                                        textTransform: 'none',
                                    }}
                                >
                                    <ClearRoundedIcon style={{ marginRight: '8px', fontSize: '1.3em' }} />
                                    Cancel Session
                                </Button>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>

            <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
                <Box sx={modalStyle}>
                    <div style={{ padding: '10% 10% 10% 10%', textAlign: 'center' }}>
                        <CheckCircleIcon style={{ color: '#7d57fc', fontSize: '50px' }} />
                        <Typography
                            variant="h6"
                            component="h2"
                            style={{
                                color: 'black',
                                padding: '25px',
                                borderRadius: '10px 10px 0 0',
                                textAlign: 'center',
                                width: '100%',
                            }}
                        >
                            {successMessage}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setSuccessModalOpen(false)}
                            style={{
                                backgroundColor: '#7d57fc',
                                color: 'white',
                                borderRadius: '10px',
                                flex: 0.2,
                                transition: 'background-color 0.3s',
                                textTransform: 'none',
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>
 
            <Modal
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
                aria-labelledby="confirmation-modal-title"
                aria-describedby="confirmation-modal-description"
            >
                <Box sx={modalStyle}>
                    <div style={{ padding: '10% 10% 10% 10%', textAlign: 'center' }}>
                        <Typography
                            id="confirmation-modal-title"
                            variant="h4"
                            component="h2"
                            style={{ color: '#7D57FC', padding: '0 25px', fontWeight:'bold' }}
                        >
                            Cancel Session
                        </Typography>
                        <Typography id="confirmation-modal-description" variant="body1" style={{ marginBottom: '40px' }}>
                            Are you sure you want to cancel this team's session?
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                onClick={() => setConfirmationOpen(false)}
                                sx={cancelButtonStyles}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCancelSession}
                                sx={confirmButtonStyles}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </div>
                </Box>
            </Modal>

        </div>
    );
}