import { Team } from '@/Utils/Global_variables'
import React from 'react'
import QueueingTeam from './QueueingTeam'
import { Typography } from '@mui/material'

interface QueueingListProps{
    teams:Set<Team>
}

const QueueingList:React.FC<QueueingListProps> = ({teams}) => {
    return (
        <div className='p-3 px-5 border-2 border-black bg-white rounded-md flex flex-col gap-10 h-full'>
            <Typography variant='subtitle1'>Up Next</Typography>
        {Array.from(teams).map((team,index)=>(
            <QueueingTeam key={index} index={index} team={team}/>
        ))}
        </div>
    )
}

export default QueueingList
