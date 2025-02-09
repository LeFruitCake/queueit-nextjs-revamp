"use client"
import BackButton from '@/Components/BackButton'
import BaseComponent from '@/Components/BaseComponent'
import { useClassroomContext } from '@/Utils/ClassroomContext'
import { Avatar, Button, Modal, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import person from '../../../../public/images/pointingUpwardPerson.png'
import whiteStar from '../../../../public/images/star-white.png'
import whiteSquiggly from '../../../../public/images/squiggly-white.png'
import { sampleGroupMembers, sampleTeams } from '@/Sample_Data/SampleData1'
import GroupBar from '@/Components/GroupBar'
import { dpurple } from '@/Utils/Global_variables'
import { capitalizeFirstLetter, stringAvatar } from '@/Utils/Utility_functions'

const page = () => {
  const teams = sampleTeams
  const classroomContext = useClassroomContext().classroom
  const [classroom, setClassroom] = useState(classroomContext)
  const [viewEnrolleesModalOpen, setViewEnrolleesModalOpen] = useState(false)
  const openViewEnrolleesModal = ()=>{
    setViewEnrolleesModalOpen(true)
  }
  const closeViewEnrolleesModal = ()=>{
    setViewEnrolleesModalOpen(false)
  }
  const router = useRouter()
  useEffect(()=>{
    if(classroomContext){
      setClassroom(classroomContext)
    }
  },[classroomContext,router])
  return (
    <BaseComponent opacity={1}>
      <div className='bg-dpurple flex flex-col flex-grow w-full h-full relative mt-5 rounded-md'>
        <img src={person.src} alt="person" className='absolute hidden lg:block xl:block left-0 bottom-0' style={{height:'70%', zIndex:2}} />
        <img className='hidden lg:block xl:block' src={whiteSquiggly.src} alt="conductor" style={{position:'absolute', height:'25%', bottom:190, left:350, zIndex:1}}/>
        <img className='hidden lg:block xl:block' src={whiteStar.src} alt="conductor" style={{position:'absolute', height:'10%', bottom:350, left:50}}/>
        <div className='p-3'>
          <BackButton/>
        </div>
        <Typography variant='h4' className='text-white text-center text-lg'>{`${classroom?.courseCode} - ${classroom?.section}`}</Typography>
        <Typography variant='h2' className='text-white text-center text-lg font-bold'>{classroom?.courseDescription}</Typography>
        <a onClick={openViewEnrolleesModal} className='text-white text-center text-lg cursor-pointer' style={{textDecoration:'underline'}}>View enrolled students</a>
        <Modal open={viewEnrolleesModalOpen} onClose={closeViewEnrolleesModal}>
          <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)'}} className='p-5 w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/2 bg-white rounded-md flex flex-col gap-10'>
            <Typography variant='h5' sx={{color:dpurple, textAlign:'center'}}>Enrolled Students</Typography>
            <div className='flex flex-grow flex-col h-96 overflow-y-auto p-3 gap-3'>
              {sampleGroupMembers.map((member, index)=>(
                  <div className=' md:bg-gray-100 lg:bg-gray-100 xl:bg-gray-100 flex gap-5 p-5 items-center rounded-md' key={index}>
                    <Avatar {...stringAvatar(`${member.firstname} ${member.lastname}`)}/>
                    <div>
                      <Typography fontWeight='bold' variant='subtitle1'>{`${capitalizeFirstLetter(member.firstname)} ${capitalizeFirstLetter(member.lastname)}`}</Typography>
                      <Typography style={{textDecoration:'underline'}} variant='caption'>{member.email}</Typography>
                    </div>
                  </div>
              ))}
            </div>
            <Button onClick={closeViewEnrolleesModal} sx={{backgroundColor:dpurple, color:'white', width:'fit-content', padding:'1em 1.5em', alignSelf:'center'}}>Close</Button>
          </div>
        </Modal>
        <div className='w-full h-full lg:w-1/2 xl:w-1/2 border-red-500 flex-grow p-3 flex flex-col gap-5 h-full overflow-auto' style={{alignSelf:'end'}}> 
          {teams.map((team,index)=>(
            <GroupBar key={index} team={team} index={index}/>
          ))}
        </div>
      </div>
    </BaseComponent>
  )
}

export default page
