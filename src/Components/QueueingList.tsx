import { dpurple, Team, UserType } from '@/Utils/Global_variables'
import React from 'react'
import QueueingTeam from './QueueingTeam'
import { Button, Typography } from '@mui/material'
// import catLoader from '../../public/loaders/catloader.gif'
import flowerLoader from '../../public/loaders/flower-loader.gif'
import { useUserContext } from '@/Contexts/AuthContext'

interface QueueingListProps{
    teams:Array<Team>|undefined
}

const QueueingList:React.FC<QueueingListProps> = ({teams}) => {
    const user = useUserContext().user
    return (
        <div className='p-3 px-5 border-2 border-black bg-white rounded-md flex flex-col flex-grow overflow-auto ' style={{maxHeight:'950px'}}>
            
        {teams?
            <div>
                <Typography variant='h6'>{teams?<>Up Next</>:<>Awaiting Teams</>}</Typography>
                <div>
                    {Array.from(teams).map((team,index)=>(
                        <QueueingTeam key={index} index={index} team={team}/>
                    ))}
                </div>
            </div>
            :
            <div className='flex-grow flex items-center justify-center flex-col gap-6'>
                <img src={flowerLoader.src} alt="catLoader" style={{height:'20%', width:'12%', alignSelf:'center', justifySelf:'center'}} />
                <Typography variant='caption' color='gray'>Queue is currently empty. Awaiting queueing teams.</Typography>
                {
                    user?.role == UserType.STUDENT?
                    <Button sx={{backgroundColor:dpurple, color:'white', padding:'0.5em 2.5em'}}>
                        Queue
                    </Button>
                    :
                    <></>
                }
            </div>
        }
        </div>
    )
}

export default QueueingList
