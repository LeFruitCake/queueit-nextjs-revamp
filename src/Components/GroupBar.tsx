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
    const router = useRouter(); // Get the router instance
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent the default anchor behavior
        setTeam(team) // Set the classroom in context
        router.push('/dashboard/classroom/group'); // Navigate to the classroom page
    };
    return (
        <div onClick={handleClick} className={`w-full h-20 border-2 border-black rounded-md p-5 flex items-center font-bold z-10 cursor-pointer
            ${index % 2 === 0 ? 'bg-gradient-to-r from-lgreen to-white' : 'bg-gradient-to-l from-lgreen to-white'}`}>
            {team.groupName}
        </div>
    )
}

export default GroupBar
