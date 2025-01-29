import { Typography } from '@mui/material'
import React from 'react'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import conductor from '../../public/images/conductor.png'

interface GreetingBarProps{
    name:string|"loading"
}

const GreetingBar:React.FC<GreetingBarProps> = ({name}) => {
    return (
        <div className='w-full bg-dpurple p-10 rounded-xl mt-10 relative'>
            <Typography variant='h3' color='white'>Hello, {capitalizeFirstLetter(name)}!</Typography>
            <Typography color='white'>It's nice to see you here...</Typography>
            <img className='hidden lg:block xl:block' src={conductor.src} alt="conductor" style={{position:'absolute', height:'180%', bottom:-30, right:0}}/>
        </div>
    )
}

export default GreetingBar
