"use client"

import BaseComponent from '@/Components/BaseComponent'
import QueueingPageFacultyView from '@/Components/QueueingPageFacultyView'
import QueueingPageStudentView from '@/Components/QueueingPageStudentView'
import { useUserContext } from '@/Contexts/AuthContext'
import { useClassroomContext } from '@/Contexts/ClassroomContext'
import { useFacultyContext } from '@/Contexts/FacultyContext'
import { useQueueingManagerContext } from '@/Contexts/QueueingManagerContext'
import { QueueingManager, QUEUEIT_URL, UserType } from '@/Utils/Global_variables'
import { useWebSocket } from '@/WebSocket/WebSocketContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const page = () => {
    const user = useUserContext().user
    const client = useWebSocket();
    const {QueueingManager, setQueueingManager} = useQueueingManagerContext()
    const classroom = useClassroomContext().classroom
    const router = useRouter()
    const faculty = useFacultyContext().Faculty

    useEffect(()=>{
      if(!user){
        router.push('/login')
      }

      if(!classroom && user?.role==UserType.STUDENT){
        router.push('/dashboard')
      }
    },[])

    useEffect(()=>{

      //if walay queueing manager, nya dapat naay classroom (for student), or dapat ang user kay faculty.
      // if(!QueueingManager && (classroom || user?.role == UserType.FACULTY)){
        fetch(`${QUEUEIT_URL}/faculty/getQueueingManager/${user?.role == UserType.FACULTY?user.uid:faculty?.uid}`)
        .then(async(res)=>{
          const response = await res.json()
          setQueueingManager(response)
        })
        .catch((err)=>{
          console.log(`Fetching queueing manager error ${err}`)
        })
      // }
    },[])

    useEffect(()=>{
      if (client) {
        const queueingStatusSubscription = client.subscribe(`/topic/queueStatus/adviser/${user?.role == UserType.FACULTY?user.uid:faculty?.uid}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            // console.log(`Received from websocket! ${receivedMessage}`)
            (console.log(receivedMessage))
            if(receivedMessage === true){
              fetch(`${QUEUEIT_URL}/faculty/getQueueingManager/${user?.role == UserType.FACULTY?user.uid:faculty?.uid}`)
              .then(async(data)=>{
                  switch(data.status){
                      case 200:
                          const response:QueueingManager = await data.json()
                          console.log(response)
                          setQueueingManager(response);
                          break;
                      default:
                          toast.error("Something went wrong while fetching Faculty active status.")
                  }
              })
              .catch((err)=>{
                  console.log(err)
                  toast.error("Caught an exception while fetching Faculty active status.")
              })
            }else{
              setQueueingManager((prev:QueueingManager) => ({
                ...prev, // Spread the previous state
                queueingEntries: receivedMessage // Update the queueingEntries with the new data
              }))
            }
        });

        const facultyStatusSubscription = client.subscribe(`/topic/facultyActivity/adviser/${user?.role == UserType.FACULTY?user.uid:classroom?.uid}`, (message) => {
                        const receivedMessage:QueueingManager = JSON.parse(message.body);
                        console.log(receivedMessage)
                        setQueueingManager(receivedMessage)
                    });

        return () => {
            console.log('Unsubscribing');
            queueingStatusSubscription.unsubscribe();
            facultyStatusSubscription.unsubscribe();
        };
      }
    },[client])
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