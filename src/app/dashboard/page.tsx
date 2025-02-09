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
        <BaseComponent opacity={1}>
            <div className="flex flex-col items-center justify-start w-full px-6 mt-3 min-h-screen">
                {userContext.user?.role == UserType.FACULTY?
                    <>
                        <GreetingBar name={'Teacher ' + user.firstname}/>
                        <ClassroomList classrooms={user?.enrolledClasses}/>
                    </>
                    :
                    <>
                        <GreetingBar name={user.firstname}/>
                        <ClassroomList classrooms={user?.enrolledClasses}/>
                    </>
                }
                
            </div> 
        </BaseComponent> 
    )
}
