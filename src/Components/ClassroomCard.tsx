import { useClassroomContext } from '@/Utils/ClassroomContext';
import { Classes } from '@/Utils/Global_variables';
import { randomPerson } from '@/Utils/Utility_functions';
import { Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ClassroomCardProps {
    classroom: Classes;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom }) => {
    const { setClassroom } = useClassroomContext(); // Destructure setClassroom from context
    const router = useRouter(); // Get the router instance

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent the default anchor behavior
        setClassroom(classroom); // Set the classroom in context
        router.push('/dashboard/classroom'); // Navigate to the classroom page
    };

    return (
        <div 
            onClick={handleClick} 
            className={`rounded-lg border-2 border-black hover:border-2 hover:border-lgreen cursor-pointer relative px-5 py-5`} 
            style={{ width: '320px', boxShadow: '10px 10px 0px 0.1px rgba(0, 0, 0,1)', height: '200px' }}
        >
            <Typography variant='h6' fontWeight='bold' style={{ zIndex: 1, position: 'relative' }}>
                {classroom.courseDescription}
            </Typography>
            <Typography style={{color:'rgba(125,87,252,0.9)', fontWeight:'bold', zIndex:1, position:'relative'}}>{`${classroom.courseCode} - ${classroom.section}`}</Typography>
            <img className='hidden md:block lg:block xl:block' src={randomPerson()} alt="person" style={{ position: 'absolute', bottom: -25, right: 0, height: '80%', zIndex: 0, mixBlendMode: 'multiply'  }} />
        </div>
    );
};

export default ClassroomCard;