"use client";
import BaseComponent from '@/Components/BaseComponent';
import { useUserContext } from '@/Utils/AuthContext';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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

export default function Page() {
    const userContext = useUserContext();
    const user = userContext.user;

    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [groupName, setGroupName] = useState<string>('');
    const [sessionType, setSessionType] = useState<string>('');

    const handleDateSelect = (selectInfo: any) => {
        setSelectedDate(selectInfo.start);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setStartTime('');
        setEndTime('');
        setGroupName('');
        setSessionType('');
    };

    const handleSubmit = () => {
        console.log('Scheduled Meeting:', {
            date: selectedDate,
            startTime,
            endTime,
            groupName,
            sessionType,
        });
        handleClose();
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
                            `}
                        </style>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            selectable={true} // Enable selection
                            select={handleDateSelect} // Handle date selection
                            headerToolbar={{
                                start: 'dayGridMonth,timeGridWeek,timeGridDay',
                                center: 'title',
                                right: 'prev,next'
                            }}
                        />
                    </div>
                </div>
            </BaseComponent>

            <Modal
            open={open}
            onClose={() => {}}
        >
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
                    {selectedDate && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '25px 0' }}>
                            <Typography variant="body1" style={{ textAlign: 'left' }}>
                                Date:
                            </Typography>
                            <Typography variant="body1" style={{ textAlign: 'right', fontWeight:'bold' }}>
                                {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getDate()}, {selectedDate.getFullYear()}
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
                    />
                </div>
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
                                backgroundColor: '#7d57fc',
                                color: 'white',
                                borderRadius: '10px',
                                flex: 0.2, 
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a0c9d'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7d57fc'}
                        >
                            Set
                        </Button>
                </div>
                </div>
            </Box>
        </Modal>
        </div>
    );
}