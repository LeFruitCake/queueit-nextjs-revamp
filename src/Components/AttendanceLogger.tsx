import { User } from '@/Utils/Global_variables'
import React from 'react'
import AttendanceLoggerCard from './AttendanceLoggerCard'

interface AttendanceLoggerProps{
    members:Set<User>
}

const AttendanceLogger:React.FC<AttendanceLoggerProps> = ({members}) => {
    return (
        <div className='p-3 bg-gray-100 rounded-md'>
            <p style={{fontSize:'1.5em', fontWeight:'bold'}}>Attendance</p>
            {/* <div className='flex justify-between w-full'>
                <span style={{flex:1}}>Name</span>
                <span style={{flex:1, display:'flex', justifyContent:'center'}}>Date</span>
            </div> */}
            {Array.from(members).map((member, index)=>(
                <AttendanceLoggerCard key={index} member={member}/>
            ))}
        </div>
    )
}

export default AttendanceLogger
