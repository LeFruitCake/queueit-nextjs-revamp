"use client"
import BaseComponent from '@/Components/BaseComponent'
import ClassroomList from '@/Components/ClassroomList';
import GreetingBar from '@/Components/GreetingBar';
import { useUserContext } from '@/Utils/AuthContext'
import { UserType } from '@/Utils/Global_variables';
import React from 'react'

export default function page() {
    const userContext = useUserContext();
    const user = userContext.user
    console.log(user?.enrolledClasses)
    return (
        <div className='h-screen overflow-auto'>
            <BaseComponent>
                <GreetingBar name={user?.role == UserType.FACULTY?`Teacher ${user?.firstname}`:user?.firstname}/>
                <ClassroomList classrooms={user?.enrolledClasses}/>
            </BaseComponent>
        </div>
    )
}
