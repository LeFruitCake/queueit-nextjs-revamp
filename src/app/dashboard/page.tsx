"use client"
import BaseComponent from '@/Components/BaseComponent'
import ClassroomList from '@/Components/ClassroomList';
import GreetingBar from '@/Components/GreetingBar';
import { useUserContext } from '@/Contexts/AuthContext'
import { Classes, SPEAR_URL, UserType } from '@/Utils/Global_variables';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Page() {
    const userContext = useUserContext();
    const user = userContext.user;
    const router = useRouter();
    const [classes, setClasses] = useState<Classes | undefined>(undefined);

    useEffect(() => {
        if (!userContext.user) {
            router.push('/login');
            return; // Exit early if user is not logged in
        }

        const fetchClasses = async () => {
            let response;
            if (user?.role === UserType.STUDENT) {
                response = await fetch(`${SPEAR_URL}/student/${user.uid}/enrolled-classes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else if (user?.role === UserType.FACULTY) {
                response = await fetch(`${SPEAR_URL}/teacher/classes-created/${user.uid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            const data = await response?.json();
            setClasses(data);
            localStorage.setItem('classroom', JSON.stringify(data)); // Store in localStorage
        };

        fetchClasses();
    }, [userContext, user]);

    useEffect(() => {
        // Store classroom in localStorage whenever it changes
        if (classes) {
            localStorage.setItem('classroom', JSON.stringify(classes));
        } else {
            localStorage.removeItem('classroom'); // Clear if undefined
        }
    }, [classes]);

    return (
        <div className='h-screen overflow-auto'>
            {userContext.user ? (
                <BaseComponent>
                    <GreetingBar name={user?.role === UserType.FACULTY ? `Teacher ${user?.firstname}` : user?.firstname} />
                    <ClassroomList classrooms={classes} />
                </BaseComponent>
            ) : (
                <>Loading</>
            )}
        </div>
    );
}