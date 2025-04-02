"use client"
import { useTeamContext } from '@/Contexts/TeamContext'
import { Typography } from '@mui/material'
import React from 'react'

const MilestoneProgressBar = () => {
    const team = useTeamContext().Team

    return (
        <div className='w-full flex flex-col bg-dpurple p-3 rounded-md border border-black'>
            <div className='flex justify-between items-center'>
                <Typography variant='subtitle1' color='white' fontWeight={"bold"}>Milestone</Typography>
                <Typography variant='h6' color='white' fontWeight={"bold"}>0 %</Typography>
            </div>
            <div className='w-full overflow-auto flex gap-1 py-3'>
                {Array.from({length:30}).fill(0).map((_,index)=>(
                    <div key={index} className={`h-10 w-40 bg-lgreen flex-shrink-0 ${index===0?'rounded-r-sm':index===29?'rounded-l-sm':'rounded-sm'}`}>
                        
                    </div>
                ))}
            </div>
        
        </div>
    )
}

export default MilestoneProgressBar
