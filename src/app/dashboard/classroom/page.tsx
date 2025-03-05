"use client"
import BaseComponent from '@/Components/BaseComponent'
import React from 'react'
import { UserType } from '@/Utils/Global_variables'
import ClassroomDetailStudentView from '@/Components/ClassroomDetailStudentView'
import ClassroomDetailFacultyView from '@/Components/ClassroomDetailFacultyView'
import { useUserContext } from '@/Contexts/AuthContext'


const page = () => {
  const user = useUserContext().user
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

export default page
