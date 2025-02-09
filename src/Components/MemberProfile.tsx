import { User } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, randomAvatar, stringAvatar } from '@/Utils/Utility_functions'
import { Avatar, Typography } from '@mui/material'
import React from 'react'

interface MemberProfileProps{
    member:User
}

const MemberProfile:React.FC<MemberProfileProps> = ({member}) => {
    return (
        <div className='bg-white rounded-md flex justify-center items-center flex-col w-40 overflow-hidden'>
            <img src={randomAvatar()} alt="avatar" />
            <Typography fontWeight='bold' variant='subtitle1'>{`${capitalizeFirstLetter(member.firstname)} ${capitalizeFirstLetter(member.lastname)}`}</Typography>
        </div>
    )
}

export default MemberProfile
