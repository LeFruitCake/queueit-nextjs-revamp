import { millisecondsToHMS } from '@/Utils/Utility_functions'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface StopQueueingButtonProps{
    timeStop: Date|null
}

const StopQueueingButton:React.FC<StopQueueingButtonProps> = ({timeStop}) => {
    const endTime = timeStop?.getTime()
    const [difference, setDifference] = useState(null);
    useEffect(()=>{
        const intervalID = setInterval(()=>{
            millisecondsToHMS(endTime,setDifference)
            if (endTime && endTime <= Date.now()){
                clearInterval(intervalID);
                // closeQueueing();
            }
        },1000)
        return ()=>{
            clearInterval(intervalID)
        }
      },[endTime])
    return (
        <Button>
            
        </Button>
    )
}

export default StopQueueingButton