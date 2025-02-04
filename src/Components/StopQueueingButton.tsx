import { dpurple } from '@/Utils/Global_variables'
import { millisecondsToHMS } from '@/Utils/Utility_functions'
import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

interface StopQueueingButtonProps{
    timeStop: number|null
    isQueueingOpen: boolean
    setIsQueueingOpen: Function
}

const StopQueueingButton:React.FC<StopQueueingButtonProps> = ({timeStop, isQueueingOpen, setIsQueueingOpen}) => {
    const endTime = timeStop
    const timeNow = new Date().getTime()
    const [difference, setDifference] = useState(null);
    useEffect(()=>{
        // console.log(`timeStop: ${timeStop} and timeNow: ${timeNow} difference: ${difference}`)
        if(endTime && endTime > timeNow && isQueueingOpen){
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
        }
      },[endTime, difference])
    return (
        <Button onClick={()=>{setIsQueueingOpen(false)}} sx={{position:'relative', backgroundColor:dpurple, color:'white', width:'100%'}} className='h-24'>
            {isQueueingOpen?
                difference == null?<>Close Queueing</>:<>{`Queueing ends in ${difference}`}</>
                :
                <></>
            }
        </Button>
    )
}

export default StopQueueingButton