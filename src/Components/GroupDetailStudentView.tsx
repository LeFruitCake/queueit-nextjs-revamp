import React from 'react'
import BaseComponent from './BaseComponent'
import BackButton from './BackButton'
import { useTeamContext } from '@/Utils/TeamContext'
import { Typography } from '@mui/material'
import { randomSeason } from '@/Utils/Utility_functions'


const GroupDetailStudentView = () => {
    const team = useTeamContext().Team
    return (
        <div className='bg-dpurple w-full h-40 flex relative rounded-md items-center p-3'>
            <BackButton/>
            <div className='flex flex-col justify-start gap-3 flex-1 px-5'>
                <Typography variant='h5' color='white' fontWeight='bold'>{team?.classRef.courseDescription}</Typography>
                <Typography>{team?.classRef.section}</Typography>
            </div>
            <img src={randomSeason()} alt="season" style={{height:'250%', position:'absolute', bottom:0, right:0}}/>
        </div>
    )
}

export default GroupDetailStudentView