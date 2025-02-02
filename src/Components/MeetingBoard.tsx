import { Team } from '@/Utils/Global_variables'
import React from 'react'
import AttendanceLogger from './AttendanceLogger'

interface MeetingBoardProps{
    team:Team
}

const MeetingBoard:React.FC<MeetingBoardProps> = ({team}) => {
    return (
        <div className='border-2 border-black rounded-md flex flex-col p-3 bg-white gap-3'>
            <p>Consultation Note</p>
            <div className='w-full flex flex-col lg:flex-row xl:flex-row gap-3'>
                <div className='flex-1'>
                    <AttendanceLogger members={team.members}/>
                </div>
                <div className='flex-1'>
                    test
                </div>
            </div>
        </div>
    )
}

export default MeetingBoard
