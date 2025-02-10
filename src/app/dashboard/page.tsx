"use client"
import BaseComponent from '@/Components/BaseComponent'
import ClassroomList from '@/Components/ClassroomList';
import GreetingBar from '@/Components/GreetingBar';
import { useUserContext } from '@/Utils/AuthContext'
import { UserType } from '@/Utils/Global_variables';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function page() {
    const userContext = useUserContext();
    const user = userContext.user
    const router = useRouter()
    useEffect(()=>{
        if(!userContext.user){
            router.push('/login')
        }
    },[userContext])
    return (
        <div className='h-screen overflow-auto'>
            {userContext.user?
                <BaseComponent>
                    <GreetingBar name={user?.role == UserType.FACULTY?`Teacher ${user?.firstname}`:user?.firstname}/>
                    {/* <ClassroomList classrooms={user?.enrolledClasses}/> */}
                </BaseComponent>
                :
                <>Loading</>
            }
        </div>
    )
}
