import { Classes, dpurple, UserType } from '@/Utils/Global_variables'
import React from 'react'
import ClassroomCard from './ClassroomCard';
import witch from '../../public/loaders/witchloader.gif'
import { Button, Typography } from '@mui/material';
import { useUserContext } from '@/Contexts/AuthContext';

interface ClassroomListProps{
    classrooms: Array<Classes> | null
}

const ClassroomList:React.FC<ClassroomListProps> = ({classrooms}) => {
    const classes = classrooms? Array.from(classrooms) : [];
    const user = useUserContext().user
    return (
        <div className='border-2 border-black mt-5 rounded-xl relative bg-white p-10 flex flex-wrap gap-12'>
            {classrooms?.length > 0?
                <>
                    {classes.map((classs, index)=>(
                        <ClassroomCard key={index} classroom={classs}/>
                    ))}
                </>
                :
                <div className='relative z-10 p-10 flex flex-col w-full justify-center items-center gap-10'>
                    <img src={witch.src} alt="witchLoader" style={{height:'75px'}} />
                    <Typography variant='Subtitle1' color='gray' fontWeight='bold'>Oh no! You see the witch too!?</Typography>
                    <Typography variant='caption' color='gray'>Guess she's determined you don't belong to any classrooms. Time to get involved in one then!</Typography>
                    {user.role == UserType.FACULTY?<Button sx={{backgroundColor:dpurple, color:'white', padding:'0.5em 2em'}}>Create Classroom</Button>:<Button sx={{backgroundColor:dpurple, color:'white', padding:'0.5em 2em'}}>Enroll</Button>}
                </div>
            }
        </div>
    )
}

export default ClassroomList
