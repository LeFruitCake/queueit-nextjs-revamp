import { Team } from '@/Utils/Global_variables'
import React from 'react'

interface QueueingTeamProps{
    team:Team
}

const QueueingTeam:React.FC<QueueingTeamProps> = ({team}) => {
  return (
    <div>
      {team.groupName}
      {team.classRef.section}{team.project.adviser.uid}
    </div>
  )
}

export default QueueingTeam
