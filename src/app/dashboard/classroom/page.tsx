"use client"
import BackButton from '@/Components/BackButton'
import BaseComponent from '@/Components/BaseComponent'
import { useClassroomContext } from '@/Utils/ClassroomContext'
import { Avatar, Button, Modal, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { sampleGroupMembers, sampleTeams } from '@/Sample_Data/SampleData1'
import GroupBar from '@/Components/GroupBar'
import { dpurple, UserType } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, stringAvatar } from '@/Utils/Utility_functions'
import GroupDetailStudentView from '@/Components/GroupDetailStudentView'
import GroupDetailAdviserView from '@/Components/GroupDetailAdviserView'
import { useUserContext } from '@/Utils/AuthContext'


const page = () => {
  const user = useUserContext().user
  const teams = sampleTeams
  const classroomContext = useClassroomContext().classroom
  const router = useRouter()
  return (
    <BaseComponent opacity={0.25}>
      {user?.role == UserType.STUDENT?
        <GroupDetailStudentView/>
        :
        <GroupDetailAdviserView/>
        }
    </BaseComponent>
  )
}

export default page
