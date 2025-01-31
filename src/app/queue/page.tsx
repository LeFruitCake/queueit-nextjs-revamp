"use client"

import BaseComponent from '@/Components/BaseComponent'
import LetThemInModal from '@/Components/LetThemInModal'
import QueueingList from '@/Components/QueueingList'
import StopQueueingButton from '@/Components/StopQueueingButton'
import { classroom1, classroom2, faculty, student, useUserContext } from '@/Utils/AuthContext'
import { Classes, ProjectProposal, Team, User, UserType } from '@/Utils/Global_variables'
import { isPastTime } from '@/Utils/Utility_functions'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const c1 = classroom1
const c2 = classroom2

const classSet = new Set()
classSet.add(c1)
classSet.add(c2)

const user1:User = {
  "uid":1,
  "firstname":"angeline",
  "lastname":"damao",
  "email":"angeline.damao@cit.edu",
  "password":"test",
  "role":UserType.STUDENT,
  "isDeleted":false,
  "interests":"",
  "enrolledClasses":classSet as Set<Classes>
}

const fac = faculty

const team1Proposal:ProjectProposal = {
  "pid":1,
  "proposedBy":user1,
  "projectName":"SPEAR",
  "classProposal":c1,
  "description":"none",
  "status":"PENDING",
  "reason":"None",
  "adviser":faculty,
  "isDeleted":false
}

const team1:Team = {
  "tid":1,
  "groupName":'SPEAR',
  "project":team1Proposal,
  "leader":user1,
  "classRef":c1,
  "members": new Set().add(student) as Set<User>,
  "isRecruitmentOpen":false,
  "isDeleted":false
}

const user2:User = {
  "uid":2,
  "firstname":"mj",
  "lastname":"tejero",
  "email":"mj.tejero@cit.edu",
  "password":"test",
  "role":UserType.STUDENT,
  "isDeleted":false,
  "interests":"",
  "enrolledClasses":classSet as Set<Classes>
}

const team2Proposal:ProjectProposal = {
  "pid":2,
  "proposedBy":user2,
  "projectName":"SPEAR",
  "classProposal":c1,
  "description":"none",
  "status":"PENDING",
  "reason":"None",
  "adviser":faculty,
  "isDeleted":false
}

const team2:Team = {
  "tid":2,
  "groupName":'Queueit',
  "project":team2Proposal,
  "leader":student,
  "classRef":c1,
  "members": new Set().add(student) as Set<User>,
  "isRecruitmentOpen":false,
  "isDeleted":false
}

const teams = new Set([team1,team2])

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
          <div className='relative pt-5 flex-grow flex flex-col-reverse lg:flex-row xl:flex-row w-full'>
            <div className='w-full md:w-1/4 lg:w-1/4 xl:w-1/4 h-full' style={{minWidth:'300px'}}>
              <StopQueueingButton isQueueingOpen={isQueueingOpen} timeStop={timeStop} setIsQueueingOpen={setIsQueueingOpen}/>
              <QueueingList teams={teams}/>
            </div>
          </div>
        }
      </BaseComponent>
    )
}

export default page