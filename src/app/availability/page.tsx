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
// import { useUserContext } from '@/Contexts/AuthContext';
import { useUserContext } from '@/Utils/AuthContext';


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

interface CalendarEvent {
    start: Date;
    end: Date;
    backgroundColor: string;
    type: 'scheduledMeeting' | 'upcomingEvent';
    groupName?: string;
    sessionType?: string;
}

const groupNames = [
    'Group A',
    'Boy B',
    'Cat C',
    'Delta D',
    'Elephant E',
];

export default function Page() {
    const userContext = useUserContext();
    const user = userContext.user;

    const [open, setOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [groupName, setGroupName] = useState<string>('');
    const [sessionType, setSessionType] = useState<string>('');
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    // State for the event details modal
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);

    // Hardcoded array of scheduled meetings
    const scheduledMeetings: CalendarEvent[] = [
        {
            // title: "Team Sync",
            start: new Date(2025, 1, 15, 10, 0),
            end: new Date(2025, 1, 15, 11, 0),
            backgroundColor: '#7D57FC',
            type: 'scheduledMeeting', // Set type
            groupName: "Team Sync", // Example group name
            sessionType: "Consultation",
        },
        {
            // title: "Project Kickoff",
            start: new Date(2025, 1, 16, 14, 0),
            end: new Date(2025, 1, 16, 15, 0),
            backgroundColor: '#7D57FC',
            type: 'scheduledMeeting', // Set type
            groupName: "Project Kickoff", // Example group name
            sessionType: "Presentation",
        },
    ];

    useEffect(() => {
        // Set initial events including scheduled meetings
        setEvents(prevEvents => [
            ...prevEvents,
            ...scheduledMeetings,
        ]);
    }, []);

    const handleDateSelect = (selectInfo: any) => {
        const dates = [];
        let currentDate = selectInfo.start;

        if (selectInfo.start.getTime() === selectInfo.end.getTime()) {
            dates.push(new Date(currentDate));
        } else {
            while (currentDate < selectInfo.end) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        console.log(dates);
        setSelectedDates(dates);
        setOpen(true);

        const startHour = selectInfo.start.getHours().toString().padStart(2, '0');
        const startMinute = selectInfo.start.getMinutes().toString().padStart(2, '0');
        const endHour = selectInfo.end.getHours().toString().padStart(2, '0');
        const endMinute = selectInfo.end.getMinutes().toString().padStart(2, '0');

        setStartTime(`${startHour}:${startMinute}`);
        setEndTime(`${endHour}:${endMinute}`);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedDates([]);
        setStartTime('');
        setEndTime('');
        setGroupName('');
        setSessionType('');
        setErrorMessage('');
    };

    const handleSubmit = () => {
        const startDate = new Date();
        const endDate = new Date();

        startDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0);
        endDate.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]), 0);

        if (startDate >= endDate) {
            setErrorMessage("Start time must be before the end time");
            return;
        }

        // Check for conflicts on all selected dates
        for (const selectedDate of selectedDates) {
            const eventStartDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), startDate.getHours(), startDate.getMinutes());
            const eventEndDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), endDate.getHours(), endDate.getMinutes());

            for (const event of events) {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);

                // Check if the new event overlaps with an existing event
                if (
                    eventStart.toDateString() === eventStartDate.toDateString() &&
                    eventStartDate < eventEnd && eventEndDate > eventStart
                ) {
                    setErrorMessage("Time conflict with your other schedule. Please modify the time.");
                    return;
                }
            }
        }

        setErrorMessage('');

        const newEvents = selectedDates.map(date => {
            const eventStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startDate.getHours(), startDate.getMinutes());
            const eventEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endDate.getHours(), endDate.getMinutes());

            const newEvent = {
                start: eventStartDate,
                end: eventEndDate,
                backgroundColor: '#D8FF78', // Color for upcoming events
                type: 'upcomingEvent', // Set type for upcoming events
                groupName: groupName, // Store group name
                sessionType: sessionType,
            };

            console.log("New Event Created:", newEvent); // Log the new event being created
            return newEvent; // Return the newEvent object
        });

        setEvents([...events, ...newEvents]);
        setSuccessMessage('Session Created Successfully');
        setSuccessModalOpen(true);
        handleClose();
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    const handleEventClick = (eventInfo: any) => {
        // Log the eventInfo to see what data is being passed
        console.log("Event Info:", eventInfo);

        // Set the selected event and open the details modal
        const selectedEvent = {
            start: eventInfo.event.start,
            end: eventInfo.event.end,
            backgroundColor: eventInfo.event._def.extendedProps.backgroundColor,
            type: eventInfo.event._def.extendedProps.type,
            groupName: eventInfo.event._def.extendedProps.groupName,
            sessionType: eventInfo.event._def.extendedProps.sessionType,
        };

        console.log("Selected Event:", selectedEvent); // Log the selected event
        setSelectedEvent(selectedEvent);
        setEventDetailsModalOpen(true);
    };

    const handleCancelSession = () => {
        if (selectedEvent) {
            // Remove the selected event from the events array
            setEvents(events.filter(event =>
                event.start.getTime() !== selectedEvent.start.getTime() ||
                event.end.getTime() !== selectedEvent.end.getTime()
            ));
            setConfirmationOpen(false);
            setSuccessMessage('Session Cancelled Successfully');
            setEventDetailsModalOpen(false);
            setSuccessModalOpen(true);
        }
    };

    const isFormValid = () => {
        return startTime !== '' && endTime !== '' && groupName !== '' && sessionType !== '';
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
                            height="70vh"
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            selectable={true}
                            select={handleDateSelect}
                            events={events}
                            headerToolbar={{
                                start: 'dayGridMonth,timeGridWeek,timeGridDay',
                                center: 'title',
                                right: 'prev,next'
                            }}
                            eventContent={(eventInfo) => {
                                const startTime = eventInfo.event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const endTime = eventInfo.event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                // Get sessionType and groupName from extendedProps
                                const sessionType = eventInfo.event._def.extendedProps.sessionType;
                                const groupName = eventInfo.event._def.extendedProps.groupName;

                                // Construct the display string
                                const displayTitle = sessionType === "Consultation"
                                    ? `Consultation Session - ${groupName}`
                                    : `Presentation Session - ${groupName}`;

                                return (
                                    <div style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', color: eventInfo.event._def.extendedProps.type === "upcomingEvent" ? '#000' : '#fff', backgroundColor: eventInfo.event._def.extendedProps.type === "upcomingEvent" ? eventInfo.backgroundColor : '#7d57fc', width: '100%' }}>
                                        {startTime} - {endTime} <br />
                                        <strong>{displayTitle}</strong>
                                    </div>
                                );
                            }}
                            // eventClick={(e)=>{
                            //     console.log(e.event._instance.range)
                            // }}
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
                        {selectedDates.length > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '25px 0' }}>
                                <Typography variant="body1" style={{ textAlign: 'left' }}>
                                    Date:
                                </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                    {selectedDates.length > 1
                                        ? `Every ${selectedDates.map(date => `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}`).join(', ')}`
                                        : `${selectedDates[0].toLocaleString('default', { month: 'long' })} ${selectedDates[0].getDate()}, ${selectedDates[0].getFullYear()}`}
                                </Typography>
                            </div>
                        )}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '3px 0' }}>
                            <Typography variant="body1" style={{ textAlign: 'left' }}>
                                Start Time:
                            </Typography>
                            <TextField
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
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
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                margin="normal"
                                required
                            />
                        </div>
                        <Stack spacing={2} >
                            <Autocomplete
                                freeSolo
                                options={groupNames}
                                onInputChange={(event, newInputValue) => {
                                    setGroupName(newInputValue);
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="session-type-label">Purpose</InputLabel>
                            <Select
                                labelId="session-type-label"
                                value={sessionType}
                                onChange={(e) => setSessionType(e.target.value)}
                            >
                                <MenuItem value="Presentation">Presentation</MenuItem>
                                <MenuItem value="Consultation">Consultation</MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25%' }}>
                            <Button
                                variant="outlined"
                                onClick={handleClose}
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '10px',
                                    border: 'none',
                                    flex: 0.2,
                                    marginRight: '10px',
                                    transition: 'background-color 0.3s',
                                    textTransform: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#5a0c9d';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'black';
                                }}
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

            {/* Event Details Modal */}
            <Modal open={eventDetailsModalOpen} onClose={() => setEventDetailsModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center', // Align items vertically centered
                            justifyContent: 'space-between', // Space between the items
                            backgroundColor: '#7d57fc',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '10px 10px 0 0',
                            padding: '25px', // Add padding to the container
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
                            onClick={() => alert('Meeting Started!')} // Replace with actual meeting logic
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
                                <Typography variant="body1">Purpose: </Typography>
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>{selectedEvent.sessionType}</Typography>
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

            {/* Confirmation Modal */}
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
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '10px',
                                    border: 'none',
                                    flex: 0.2,
                                    marginRight: '10px',
                                    transition: 'background-color 0.3s',
                                    textTransform: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#5a0c9d';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.color = 'black';
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCancelSession}
                                style={{
                                    backgroundColor: '#7d57fc',
                                    color: 'white',
                                    borderRadius: '10px',
                                    flex: 0.2,
                                    transition: 'background-color 0.3s',
                                    textTransform: 'none',

                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#5a0c9d';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#7d57fc';
                                }} 
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