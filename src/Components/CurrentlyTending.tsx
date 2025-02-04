import { useUserContext } from '@/Utils/AuthContext'
import { dpurple, Team, UserType } from '@/Utils/Global_variables'
import { randomGroupImage } from '@/Utils/Utility_functions'
import { Button, Typography } from '@mui/material'
import React from 'react'

interface CurrentlyTendingProps{
    team: Team
}

const CurrentlyTending:React.FC<CurrentlyTendingProps> = ({team}) => {
    const user = useUserContext().user
    return (
        <div className='border-2 border-black w-full h-fit md:h-36 lg:h-36 xl:h-36 p-3 flex items-center flex-col md:flex-row lg:flex-row xl:flex-row rounded-md bg-white'>
            <div className='h-full flex-1 flex flex-col'>
                <Typography>Currently Tending</Typography>
                <div className='relative h-full flex box-content flex-col md:flex-row lg:flex-row xl:flex-row items-center'>
                    <img src={randomGroupImage()} alt="group vector" className='block h-full' />
                    <div className='flex flex-col'>
                        <span style={{fontWeight:'bold'}}>{team.groupName}</span>
                        <Typography variant='caption' color='gray'>{team.classRef.section}</Typography>
                        <Typography variant='caption' color={dpurple}>Time elapsed: 29 minutes</Typography>
                    </div>
                </div>
            </div>
            {user?.role == UserType.FACULTY && (team.project.adviser.uid == user?.uid || team.classRef.createdBy.uid == user?.uid)?
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
