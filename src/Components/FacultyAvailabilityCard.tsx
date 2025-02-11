import { capitalizeFirstLetter, randomAvatar } from '@/Utils/Utility_functions'
import { Typography } from '@mui/material'
import React from 'react'

interface FacultyAvailabilityCardProps{
    facultyFirstname: string
    facultyLastname: string
    facultyDesignation: string
}

const FacultyAvailabilityCard:React.FC<FacultyAvailabilityCardProps> = ({facultyFirstname, facultyLastname, facultyDesignation}) => {
    return (
        <div className='bg-white h-full w-full flex flex-col relative items-center justify-around border-2 border-black rounded-lg py-5'>
            <Typography variant='h6' fontWeight='bold' textAlign='center'>{facultyDesignation}</Typography>
            <div>
                <div>
                    <img src={randomAvatar()} alt="randomAvatar" className='h-40 aspect-square'/>
                </div>
                <Typography variant='h5' fontWeight='bold' textAlign='center'>{`${capitalizeFirstLetter(facultyFirstname)} ${capitalizeFirstLetter(facultyLastname)}`}</Typography>
            </div>
            <div className='w-2/3 p-5 h-1/4 flex items-center justify-center rounded-xl border-2 border-black' style={{backgroundColor:'#E9E3FF'}}>
                <Typography variant='h5' fontWeight='bold' textAlign='center'>Unavailable</Typography>
            </div>
        </div>
    )
}

export default FacultyAvailabilityCard
