"use client"
import BaseComponent from '@/Components/BaseComponent'
import { useUserContext } from '@/Utils/AuthContext'
import React from 'react'

export default function page() {
    const userContext = useUserContext();
    console.log(userContext.user)
    return (
        <div>
            <BaseComponent>
                
            </BaseComponent>
        </div>
    )
}
