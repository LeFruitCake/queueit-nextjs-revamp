import { Team } from '@/Utils/Global_variables'
import { groupImage } from '@/Utils/Utility_functions'
import { Tooltip, Typography } from '@mui/material'
import React from 'react'

interface QueueingTeamProps{
    team:Team
    index: number
}

const QueueingTeam:React.FC<QueueingTeamProps> = ({team, index}) => {
  return (
    <div className='flex justify-between items-center overflow-hidden h-28'>
      <span className='bg-dpurple w-10 h-10 rounded-full flex items-center justify-center text-white p-5'>{index+1}</span>
      <img src={groupImage(index)} alt="group image" style={{boxSizing:'border-box', margin:0, padding:0, height:'120%', display:'block'}} />
      <div className='flex flex-col flex-1'>
        <Tooltip title={team.groupName}><Typography className='overflow-hidden max-w-full flex-nowrap whitespace-nowrap' sx={{fontWeight:'bold'}}>{team.groupName}</Typography></Tooltip>
        <Typography variant='caption' color='gray'>{team.classRef.section}</Typography>
      </div>
    </div>
  )
}

export default QueueingTeam
