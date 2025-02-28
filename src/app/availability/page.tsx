"use client";
import BaseComponent from '@/Components/BaseComponent';
import { useUserContext } from '@/Utils/AuthContext';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    title: string;
    start: Date;
    end: Date;
    backgroundColor: string;
}

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
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Hardcoded array of scheduled meetings
    const scheduledMeetings = [
        {
            title: "Team Sync",
            start: new Date(2025, 1, 15, 10, 0), // Example: October 15, 2023, 10:00 AM
            end: new Date(2025, 1, 15, 11, 0),   // Example: October 15, 2023, 11:00 AM
            backgroundColor: '#7D57FC',
        },
        {
            title: "Project Kickoff",
            start: new Date(2025, 1, 16, 14, 0), // Example: October 16, 2023, 2:00 PM
            end: new Date(2025, 1, 16, 15, 0),   // Example: October 16, 2023, 3:00 PM
            backgroundColor: '#7D57FC',
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

        // Check if the selected range is only one day
        if (selectInfo.start.getTime() === selectInfo.end.getTime()) {
            // If it's a single day, just add that date
            dates.push(new Date(currentDate));
        } else {
            // If it's a range, add all dates in the range
            while (currentDate < selectInfo.end) {
                dates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        console.log(dates); // Log the selected dates
        setSelectedDates(dates);
        setOpen(true);
        
        // Set the start and end time based on the selected range
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
    };

    const handleSubmit = () => {
        const startDate = new Date();
        const endDate = new Date();
    
        // Parse the start and end times
        startDate.setHours(parseInt(startTime.split(':')[0]), parseInt(startTime.split(':')[1]), 0);
        endDate.setHours(parseInt(endTime.split(':')[0]), parseInt(endTime.split(':')[1]), 0);
    
        // Check if start time is greater than end time
        if (startDate >= endDate) {
            setErrorMessage("Start time must be before the end time");
            return; // Prevent submission
        }
    
        // Check for time conflicts with existing events
        for (const event of events) {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
    
            // Check if the new event overlaps with existing events on the same day
            if (
                eventStart.toDateString() === startDate.toDateString() && // Same day
                (startDate < eventEnd && endDate > eventStart) // Overlap condition
            ) {
                setErrorMessage("Time conflict with your other schedule. Please modify the time.");
                return; // Prevent submission
            }
        }
    
        // Clear the error message if validation passes
        setErrorMessage('');
    
        const newEvents = selectedDates.map(date => {
            const eventStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startDate.getHours(), startDate.getMinutes());
            const eventEndDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endDate.getHours(), endDate.getMinutes());
    
            const eventTitle = sessionType === "Consultation" 
                ? `Consultation Session - ${groupName}` 
                : `Presentation Session - ${groupName}`;
    
            return {
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                backgroundColor: '#CCFC57',
            };
        });
    
        setEvents([...events, ...newEvents]);
        setSuccessModalOpen(true);
        handleClose();
    };

    const handleSuccessClose = () => {
        setSuccessModalOpen(false);
    };

    const isFormValid = () => {
        return startTime !== '' && endTime !== '' && groupName !== '' && sessionType !== '';
    };

    return (
        <div className='h-screen overflow-auto'>
            <BaseComponent>
                <div className='border-2 border-black mt-5 rounded-xl bg-white p-10 md:p-6 sm:p-4 w-full'>
                    <Typography className="text-center text-2xl md:text-xl sm:text-lg" variant='h5' fontWeight='bold' style={{ textAlign: 'center' }}>
                        Your Calendar Schedule
                    </Typography>
                    <div className="w-full overflow-x-auto">
                        <style>
                            {`
                                .fc-button {
                                    background-color: white !important;
                                    color: black !important; 
                                    border-radius: 5px !important; 
                                    padding: 5px 20px !important; 
                                    border-color: black !important;
                                    border-width:  1.5px !important;
                                    border-style: solid !important;
                                    margin-right: 10px !important;
                                    margin-top: 30px !important;
                                }
                                .fc-button:hover {
                                    background-color: #5a0c9d !important;
                                    color: white !important; 
                                }
                                .fc-button-active {
                                    background-color: #7d57fc !important;
                                    color: white !important; 
                                }
                                .fc-toolbar-title {
                                    font-size: 1.2rem !important; 
                                    margin-left: -50% !important;
                                    margin-bottom: 20px !important;
                                }
                                tr .fc-col-header-cell{
                                    background-color: #7d57fc !important;
                                    color: white !important; 
                                    overflow: auto;
                                }
                                .fc-daygrid-day {
                                    border: 1px solid black !important; 
                                }
                                table {
                                    border-collapse: collapse; 
                                    width: 100%; 
                                    border-radius: 5px !important; 
                                }
                                table, th, td {
                                    border: 1px solid black !important;
                                }
                                .fc-day-other {
                                    background-color: #e9e9e9 !important; 
                                }
                                th.fc-timegrid-axis {
                                    background-color: #7d57fc !important;
                                }
                                .fc-daygrid-event-harness {
                                    background-color: #D8FF78 !important;
                                    padding: 2px;
                                    margin-bottom: 1%;
                                }
                                .fc-event-main {
                                    overflow-y: scroll;
                                }
                                ::-webkit-scrollbar {
                                    width: 8px; /* Width of the scrollbar */
                                    height: 8px; /* Height of the scrollbar */
                                }

                                ::-webkit-scrollbar-thumb {
                                    background-color: #7d57fc; /* Color of the scrollbar thumb */
                                    border-radius: 10px; /* Rounded corners for the scrollbar thumb */
                                }

                                ::-webkit-scrollbar-track {
                                    background: #f1f1f1; /* Background color of the scrollbar track */
                                    border-radius: 10px; /* Rounded corners for the scrollbar track */
                                }

                                /* Hide the scrollbar arrows */
                                ::-webkit-scrollbar-button {
                                    display: none; /* Hides the arrows */
                                }

                                /* Thin scroll bars for Firefox */
                                * {
                                    scrollbar-width: thin; /* Use thin scrollbars */
                                    scrollbar-color: #7d57fc #f1f1f1; /* Thumb color and track color */
                                }
                            `}
                        </style>
                        <FullCalendar
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
                                return (
                                    <div style={{ whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', color: 'black' }}>
                                        {startTime} - {endTime} <br />
                                        <strong>{eventInfo.event.title}</strong>
                                    </div>
                                );
                            }}
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
                                <Typography variant="body1" style={{ textAlign: 'right', fontWeight:'bold' }}>
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
                        <TextField
                            label="Enter Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            required
                        />
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

            <Modal open={successModalOpen} onClose={handleSuccessClose}>
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
                            Session Created Successfully
                        </Typography>
                            <Button
                                variant="contained"
                                onClick={handleSuccessClose}
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
        </div>
    );
}