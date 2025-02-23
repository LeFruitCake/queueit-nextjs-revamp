import { Attendance } from '@/Utils/Global_variables'
import React from 'react'
import AttendanceLoggerCard from './AttendanceLoggerCard'

interface AttendanceLoggerProps{
    attendanceList:Array<Attendance>
    updateAttendanceStatus:Function
}

const AttendanceLogger:React.FC<AttendanceLoggerProps> = ({attendanceList, updateAttendanceStatus}) => {
    return (
        <div className='p-3 bg-gray-100 rounded-md'>
            <p style={{fontSize:'1.5em', fontWeight:'bold'}}>Attendance</p>
            {/* <div className='flex justify-between w-full'>
                <span style={{flex:1}}>Name</span>
                <span style={{flex:1, display:'flex', justifyContent:'center'}}>Date</span>
            </div> */}
            {attendanceList?.map((attendance, index)=>(
                <AttendanceLoggerCard key={index} attendance={attendance} updateAttendanceStatus={updateAttendanceStatus}/>
            ))}
        </div>
    )
}

export default AttendanceLogger
