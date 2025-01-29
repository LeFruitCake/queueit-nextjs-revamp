import { Classes } from '@/Utils/Global_variables'
import { randomPerson } from '@/Utils/Utility_functions'
import { Typography } from '@mui/material'
import React from 'react'


interface ClassroomCardProps{
    classroom:Classes
}

const ClassroomCard:React.FC<ClassroomCardProps> = ({classroom}) => {
    return (
        <a className={`rounded-lg border-2 border-black hover:border-2 hover:border-lgreen cursor-pointer relative px-5 py-10`} style={{width:'320px',boxShadow: '15px 15px 0px 0.1px rgba(0, 0, 0,1)',height:'250px'}}>
            <Typography variant='h5' fontWeight='bold' style={{zIndex:1, position:'relative'}}>{classroom.courseDescription}</Typography>
            <img src={randomPerson()} alt="person" style={{position:'absolute',bottom:0,right:0, height:'90%', zIndex:0}}/>
        </a>
    )
}

export default ClassroomCard
