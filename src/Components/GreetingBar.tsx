import { Typography } from '@mui/material'
import React from 'react'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import conductor from '../../public/images/conductor.png'
import squiggly from '../../public/images/squiggly.png'
import star from '../../public/images/star.png'

interface GreetingBarProps{
    name:string|"loading"
}

const GreetingBar:React.FC<GreetingBarProps> = ({name}) => {
    return (
        <div className='w-full bg-dpurple p-5 rounded-xl mt-0 relative'>
            <Typography variant='h3' color='white'>Hello, {capitalizeFirstLetter(name)}!</Typography>
            <Typography color='white'>It's nice to see you here...</Typography>
            <img className='hidden lg:block xl:block' src={conductor.src} alt="conductor" style={{position:'absolute', height:'180%', bottom:-30, right:0, zIndex:2}}/>
            <img className='hidden lg:block xl:block' src={squiggly.src} alt="conductor" style={{position:'absolute', height:'100%', bottom:-0, right:250, zIndex:1}}/>
            <img className='hidden lg:block xl:block' src={star.src} alt="conductor" style={{position:'absolute', height:'50%', bottom:-0, right:0}}/>
        </div>
    )
}

export default GreetingBar
