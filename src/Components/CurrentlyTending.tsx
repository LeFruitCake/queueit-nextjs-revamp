import { useUserContext } from '@/Contexts/AuthContext'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import { dpurple, Team, UserType } from '@/Utils/Global_variables'
import { randomGroupImage } from '@/Utils/Utility_functions'
import { Button, Skeleton, Typography } from '@mui/material'
import React from 'react'

interface CurrentlyTendingProps{
    team: Team | null
}

const CurrentlyTending:React.FC<CurrentlyTendingProps> = ({team}) => {
    const user = useUserContext().user
    return (
        <div className='border-2 border-black w-full h-fit md:h-36 lg:h-36 xl:h-36 p-3 flex items-center flex-col md:flex-row lg:flex-row xl:flex-row rounded-md bg-white'>
            <div className='h-full flex-1 flex flex-col'>
                <Typography variant='h6'>Currently Tending</Typography>
                <div className='relative h-full flex box-content flex-col md:flex-row lg:flex-row xl:flex-row items-center gap-3'>
                    {team?<img src={randomGroupImage()} alt="group vector" className='block h-full' />:<Skeleton sx={{height:'100%',aspectRatio:1}} variant='rectangular'/>}
                    <div className='flex flex-col'>
                        {team?<span style={{fontWeight:'bold'}}>{team?.groupName}</span>:<Skeleton variant='text' width={300}/>}
                        {/* {team?<Typography variant='caption' color='gray'>{classroom?.section}</Typography>: <Skeleton variant='text' width={300}/>} */}
                        {team?<Typography variant='caption' color={dpurple}>Time elapsed: 29 minutes</Typography>:<Skeleton variant='text' width={300}/>}
                    </div>
                </div>
            </div>
            {user?.role == UserType.FACULTY?
                <div>
                    <Button sx={{backgroundColor:dpurple, color:'white', padding:'1em 1.5em'}}>
                        Save & Continue
                    </Button>
                </div>
                :
                <></>
            }
        </div>
    )
}

export default CurrentlyTending
