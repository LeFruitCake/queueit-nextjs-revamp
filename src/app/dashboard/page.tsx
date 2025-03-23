"use client";
import BaseComponent from '@/Components/BaseComponent';
import ClassroomList from '@/Components/ClassroomList';
import GreetingBar from '@/Components/GreetingBar';
import { useUserContext } from '@/Contexts/AuthContext';
import { Classes, MentoredClasses, SPEAR_URL, UserType } from '@/Utils/Global_variables';
import { capitalizeFirstLetter } from '@/Utils/Utility_functions';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Page() {
    const userContext = useUserContext();
    const user = userContext.user;
    const router = useRouter();
    const [classes, setClasses] = useState<Classes | undefined>(undefined); 
    const [mentoredClass, setMentoredClass] = useState<MentoredClasses | undefined>(undefined); 

    const loading = useUserContext().loading

    useEffect(() => {
        if(loading){return;}
        if (!user) {
            router.push('/login');
            return; 
        }

        const fetchClasses = async () => {
            try {
                let classResponse, mentoredResponse;

                if (user.role === UserType.STUDENT) {
                    classResponse = await fetch(`${SPEAR_URL}/student/${user.uid}/enrolled-classes`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                } else if (user.role === UserType.FACULTY) {
                    classResponse = await fetch(`${SPEAR_URL}/teacher/classes-created/${user.uid}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    mentoredResponse = await fetch(`${SPEAR_URL}/mentor/classrooms/${user.uid}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                }

                if (classResponse?.ok) {
                    const classData = await classResponse.json();
                    setClasses(classData);
                    localStorage.setItem('classrooms', JSON.stringify(classData));
                }

                if (mentoredResponse?.ok) {
                    const mentoredData = await mentoredResponse.json();
                    setMentoredClass(mentoredData);
                    localStorage.setItem('mentoredClassrooms', JSON.stringify(mentoredData));
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };

        fetchClasses();
    }, [user]);

    useEffect(() => {
        if (classes) {
            localStorage.setItem('classrooms', JSON.stringify(classes));
        } else {
            localStorage.removeItem('classrooms');
        }
    }, [classes]);

    useEffect(() => {
        if (mentoredClass) {
            localStorage.setItem('mentoredClassrooms', JSON.stringify(mentoredClass));
        } else {
            localStorage.removeItem('mentoredClassrooms');
        }
    }, [mentoredClass]);

    return (
        <div className='h-screen overflow-auto'>
            {user ? (
                <BaseComponent>
                    <GreetingBar name={user.role === UserType.FACULTY ? `Teacher ${capitalizeFirstLetter(user.firstname)}` : capitalizeFirstLetter(user.firstname)} />
                    <ClassroomList classrooms={classes} mentoredClassrooms={mentoredClass} />
                </BaseComponent>
            ) : (
                <>Loading...</>
            )}
        </div>
    );
}
