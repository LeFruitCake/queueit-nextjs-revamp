import { Classes } from '@/Utils/Global_variables'
import React from 'react'
import ClassroomCard from './ClassroomCard';

interface ClassroomListProps{
    classrooms: Set<Classes> | null
}

const ClassroomList:React.FC<ClassroomListProps> = ({classrooms}) => {
    const classes = classrooms? Array.from(classrooms) : [];
    return (
        <div className='border-2 border-black mt-5 rounded-xl relative bg-white p-10 flex flex-wrap gap-16 w-full'>
            {classes.map((classs)=>(
                <ClassroomCard key={classs.cid} classroom={classs}/>
            ))}
        </div>
    )
}

export default ClassroomList
