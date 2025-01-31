import { Team } from '@/Utils/Global_variables'
import React from 'react'
import QueueingTeam from './QueueingTeam'

interface QueueingListProps{
    teams:Set<Team>
}

const QueueingList:React.FC<QueueingListProps> = ({teams}) => {
    return (
        <div>
        {Array.from(teams).map((team,index)=>(
            <QueueingTeam key={index} team={team}/>
        ))}
        </div>
    )
}

export default QueueingList
