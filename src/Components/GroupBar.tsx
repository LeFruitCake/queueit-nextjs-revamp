import { Team } from '@/Utils/Global_variables'
import { useTeamContext } from '@/Contexts/TeamContext'
import { useRouter } from 'next/navigation'
import React from 'react'

interface GroupBarProps{
    index:number
    team:Team
}

const GroupBar:React.FC<GroupBarProps> = ({index, team}) => {
    const setTeam = useTeamContext().setTeam
    const router = useRouter();  
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();  
        setTeam(team) 
        router.push('/dashboard/classroom/group'); 
    };
    return (
        <div onClick={handleClick} className={`w-full h-20 border-2 border-black rounded-md p-5 flex items-center font-bold z-10 cursor-pointer
            ${index % 2 === 0 ? 'bg-gradient-to-r from-lgreen to-white' : 'bg-gradient-to-l from-lgreen to-white'}`}>
            {team.groupName}
        </div>
    )
}

export default GroupBar
