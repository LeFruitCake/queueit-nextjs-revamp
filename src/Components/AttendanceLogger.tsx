import { Attendance } from '@/Utils/Global_variables'
import React from 'react'
import AttendanceLoggerCard from './AttendanceLoggerCard'
import { Stack, Typography } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle';

interface AttendanceLoggerProps{
    attendanceList:Array<Attendance>
    updateAttendanceStatus:Function
}

const AttendanceLogger:React.FC<AttendanceLoggerProps> = ({attendanceList, updateAttendanceStatus}) => {
    return (
        <div className='p-3 bg-gray-100 rounded-md h-full'>
            <p style={{fontSize:'1.5em', fontWeight:'bold'}}>Attendance</p>
            <Stack gap={1} direction='row' alignItems='center'>
                <CircleIcon fontSize='small' className='text-lushgreen'/> <Typography variant='caption'>Present</Typography>
                <CircleIcon fontSize='small' className='text-lushred'/> <Typography variant='caption'>Absent</Typography>
                <CircleIcon fontSize='small' className='text-lushorange'/> <Typography variant='caption'>Late</Typography>
            </Stack>
            {attendanceList?.map((attendance, index)=>(
                <AttendanceLoggerCard key={index} attendance={attendance} updateAttendanceStatus={updateAttendanceStatus}/>
            ))}
        </div>
    )
}

export default AttendanceLogger
