"use client"

import BaseComponent from '@/Components/BaseComponent'
import LetThemInModal from '@/Components/LetThemInModal'
import StopQueueingButton from '@/Components/StopQueueingButton'
import { useUserContext } from '@/Utils/AuthContext'
import { UserType } from '@/Utils/Global_variables'
import React, { useEffect, useState } from 'react'

const page = () => {
    const user = useUserContext().user
    const [isQueueingOpen, setIsQueueingOpen] = useState(user?.role == UserType.STUDENT?true:false)
    const [timeStop, setTimeStop] = useState(null)
    const [queueingLimit, setQueueingLimit] = useState(0)
    const [queueingFilter, setQueueingFilter] = useState([-1])

    return (
      <BaseComponent opacity={0.25} ovf={"hidden flex flex-col pb-5"}>
        {!isQueueingOpen && user?.role == UserType.FACULTY?

          <LetThemInModal setIsQueueing={setIsQueueingOpen} setQueueingFilter={setQueueingFilter} setQueueingLimit={setQueueingLimit} setTimeStop={setTimeStop}/>
          :
          <div className='relative border-2 border-red-500 flex-grow flex flex-col-reverse lg:flex-row xl:flex-row'>
            <div className='w-full md:w-1/4 lg:w-1/4 xl:w-1/4 h-full border-2 border-green-500 p-10' style={{minWidth:'300px'}}>
              <StopQueueingButton timeStop={timeStop}/>
            </div>
          </div>
        }
      </BaseComponent>
    )
}

export default page