import { Team } from '@/Utils/Global_variables'
import React from 'react'

interface GroupBarProps{
    index:number
    team:Team
}

const GroupBar:React.FC<GroupBarProps> = ({index, team}) => {
    return (
        <div className={`w-full h-20 border-2 border-black rounded-3xl p-5 flex items-center font-bold
            ${index % 2 === 0 ? 'bg-gradient-to-r from-lgreen to-white' : 'bg-gradient-to-l from-lgreen to-white'}`}>
            {team.groupName}
        </div>
    )
}

export default GroupBar
