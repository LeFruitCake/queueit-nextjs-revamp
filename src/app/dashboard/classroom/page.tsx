"use client"
import BaseComponent from '@/Components/BaseComponent'
import React from 'react'
import { UserType } from '@/Utils/Global_variables'
import ClassroomDetailStudentView from '@/Components/ClassroomDetailStudentView'
import ClassroomDetailFacultyView from '@/Components/ClassroomDetailFacultyView'
import { useUserContext } from '@/Contexts/AuthContext'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import NotFound from '@/Components/NotFound'
import { Typography } from '@mui/material'


const page = () => {
  const user = useUserContext().user
  const classroom = useClassroomContext().classroom
  if(!classroom){
    return(
      <BaseComponent>
        <NotFound>
          <Typography>
            Classroom not found.
          </Typography>
        </NotFound>
      </BaseComponent>
    )
  }else{
    return (
      <BaseComponent opacity={0.25}>
        {user?.role == UserType.STUDENT?
          <ClassroomDetailStudentView/>
          :
          <ClassroomDetailFacultyView/>
          }
      </BaseComponent>
    )
  }
}

export default page
