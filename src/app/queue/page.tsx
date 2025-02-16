"use client"

import BaseComponent from '@/Components/BaseComponent'
import QueueingPageFacultyView from '@/Components/QueueingPageFacultyView'
import QueueingPageStudentView from '@/Components/QueueingPageStudentView'
import { useUserContext } from '@/Contexts/AuthContext'
import { UserType } from '@/Utils/Global_variables'

const page = () => {
    const user = useUserContext().user
   
    return (
      <BaseComponent opacity={0.25}>
        {
          user?.role == UserType.FACULTY?
            <QueueingPageFacultyView/>
            :
            <QueueingPageStudentView/>
        }
      </BaseComponent>
    )
}

export default page