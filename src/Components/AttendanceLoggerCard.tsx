import { User } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, stringAvatar } from '@/Utils/Utility_functions'
import { Avatar } from '@mui/material'
import React, { useState } from 'react'

interface AttendanceLoggerCardProps{
    member:User
}

const AttendanceLoggerCard:React.FC<AttendanceLoggerCardProps> = ({member}) => {
    const now = new Date().toDateString()
    const [attendanceStatus,setAttendanceStatus] = useState(1)

    const handleAttendanceStatusChange = ()=>{
        if(attendanceStatus == 2){
            setAttendanceStatus(1)
        }else{
            setAttendanceStatus((prev)=>prev+1)
        }
    }
    return (
        <div className={`flex items-center justify-between p-3 rounded-md bg-${bg} mt-1 cursor-pointer`}>
            <div className='flex gap-3 items-center'>
                <Avatar {...stringAvatar(`${member?.firstname} ${member?.lastname}`)}/>
                <span style={{fontWeight:'bold'}}>{`${capitalizeFirstLetter(member.firstname)} ${capitalizeFirstLetter(member.lastname)}`}</span>
            </div>
            <span style={{justifySelf:'end'}}>{now}</span>
        </div>
    )
}

export default AttendanceLoggerCard
