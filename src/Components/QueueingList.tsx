import { Team } from '@/Utils/Global_variables'
import React from 'react'
import QueueingTeam from './QueueingTeam'
import { Typography } from '@mui/material'
import catLoader from '../../public/loaders/catloader.gif'

interface QueueingListProps{
    teams:Array<Team>|undefined
}

const QueueingList:React.FC<QueueingListProps> = ({teams}) => {
    return (
        <div className='p-3 px-5 border-2 border-black bg-white rounded-md flex flex-col  overflow-auto ' style={{maxHeight:'950px'}}>
            <Typography variant='subtitle1'>{teams?<>Up Next</>:<>Awaiting Teams</>}</Typography>
        {teams?
            <div>
                {Array.from(teams).map((team,index)=>(
                    <QueueingTeam key={index} index={index} team={team}/>
                ))}
            </div>
            :
            <>
                <img src={catLoader.src} alt="catLoader" style={{height:'60px', width:'30%', alignSelf:'center', justifySelf:'center'}} />
            </>
        }
        </div>
    )
}

export default QueueingList
