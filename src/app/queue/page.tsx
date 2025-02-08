"use client"

import BaseComponent from '@/Components/BaseComponent'
import Chat from '@/Components/Chat'
import CurrentlyTending from '@/Components/CurrentlyTending'
import LetThemInModal from '@/Components/LetThemInModal'
import MeetingBoard from '@/Components/MeetingBoard'
import QueueingList from '@/Components/QueueingList'
import StopQueueingButton from '@/Components/StopQueueingButton'
import { faculty, queueingManager1, teams } from '@/Sample_Data/SampleData1'
import { useUserContext } from '@/Utils/AuthContext'
import { UserType } from '@/Utils/Global_variables'
import { isPastTime } from '@/Utils/Utility_functions'
import { useState } from 'react'
import { toast } from 'react-toastify'





const page = () => {
    const user = useUserContext().user
    // const [isQueueingOpen, setIsQueueingOpen] = useState(user?.role == UserType.STUDENT?true:false)
    const [isQueueingOpen, setIsQueueingOpen] = useState(user?.role == UserType.STUDENT?true:true) // for development
    const [timeStop, setTimeStop] = useState(0)
    const [queueingLimit, setQueueingLimit] = useState(0)
    const [queueingFilter, setQueueingFilter] = useState([-1])
    const [open, setOpen] = useState(false);

    const manager = queueingManager1;
    const adviser = faculty;

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
    return (
      <BaseComponent opacity={0.25} ovf={"flex flex-col pb-5"}>
        {!isQueueingOpen && user?.role == UserType.FACULTY?

          <LetThemInModal open={open} setOpen={setOpen} openQueueing={openQueueing} setIsQueueing={setIsQueueingOpen} setQueueingFilter={setQueueingFilter} setQueueingLimit={setQueueingLimit} setTimeStop={setTimeStop}/>
          :
          <div className='relative pt-5 flex-grow min-h-full flex flex-col md:flex-row lg:flex-row xl:flex-row w-full gap-3'>
            <div className='w-full md:w-1/4 lg:w-1/4 xl:w-1/4 flex-grow flex flex-col gap-3' style={{minWidth:'300px'}}>
              <StopQueueingButton isQueueingOpen={isQueueingOpen} timeStop={timeStop} setIsQueueingOpen={setIsQueueingOpen}/>
              <QueueingList teams={manager.queueingGroups}/>
            </div>
            <div className='flex flex-col w-full gap-3' style={{minWidth:'300px'}}>
              <CurrentlyTending team={manager.tendingGroup} />
              {(user?.role == UserType.STUDENT && manager.tendingGroup.members.has(user))
                ||
                (user?.role == UserType.FACULTY)
                ?
                <MeetingBoard team={manager.tendingGroup}/>
                :<Chat adviser={faculty} chat={null}/>
              }
            </div>
          </div>
        }
      </BaseComponent>
    )
}

export default page