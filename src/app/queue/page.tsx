"use client"

import BaseComponent from '@/Components/BaseComponent'
import LetThemInModal from '@/Components/LetThemInModal'
import StopQueueingButton from '@/Components/StopQueueingButton'
import { useUserContext } from '@/Utils/AuthContext'
import { UserType } from '@/Utils/Global_variables'
import { isPastTime } from '@/Utils/Utility_functions'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {
    const user = useUserContext().user
    const [isQueueingOpen, setIsQueueingOpen] = useState(user?.role == UserType.STUDENT?true:false)
    const [timeStop, setTimeStop] = useState(0)
    const [queueingLimit, setQueueingLimit] = useState(0)
    const [queueingFilter, setQueueingFilter] = useState([-1])
    const [open, setOpen] = useState(false);

    const openQueueing = ()=>{
      if(isQueueingOpen){
        toast.error("Queueing is already open.", {autoClose:2000, style:{fontWeight:'bold'}});
      }else{
        if(isPastTime(timeStop) && timeStop != 0){
          toast.error("Time limit value is past time.")
        }else if(queueingLimit < 0){
          toast.error("Queueing limit is a negative number")
        }else if(queueingFilter.length <= 0){
          toast.error("Queueing filter is empty. Atleast select the All classroom option")
        }else{
          console.log(`timeStop: ${timeStop} queueingLimit: ${queueingLimit} filter: ${queueingFilter}`)
          setIsQueueingOpen(true)
          setOpen(false)
        }
      }
    }

    // useEffect(()=>{
    //   console.log(isQueueingOpen)
    // },[isQueueingOpen])
    return (
      <BaseComponent opacity={0.25} ovf={"hidden flex flex-col pb-5"}>
        {!isQueueingOpen && user?.role == UserType.FACULTY?

          <LetThemInModal open={open} setOpen={setOpen} openQueueing={openQueueing} setIsQueueing={setIsQueueingOpen} setQueueingFilter={setQueueingFilter} setQueueingLimit={setQueueingLimit} setTimeStop={setTimeStop}/>
          :
          <div className='relative border-2 border-red-500 flex-grow flex flex-col-reverse lg:flex-row xl:flex-row w-full'>
            <div className='w-full md:w-1/4 lg:w-1/4 xl:w-1/4 h-full p-10' style={{minWidth:'300px'}}>
              <StopQueueingButton isQueueingOpen={isQueueingOpen} timeStop={timeStop} setIsQueueingOpen={setIsQueueingOpen}/>
            </div>
          </div>
        }
      </BaseComponent>
    )
}

export default page