"use client"
import { dpurple, Grade, Meeting, QueueingEntry, Team } from '@/Utils/Global_variables'
import React, { useEffect, useState } from 'react'
import AttendanceLogger from './AttendanceLogger'
import HistoryBoard from './HistoryBoard'
import { Button, Typography } from '@mui/material'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import { useRubricContext } from '@/Contexts/RubricContext'
import SelectRubricModal from './SelectRubricModal'
import EvaluationModal from './EvaluationModal'
import { useGradesContext } from '@/Contexts/GradesContext'

interface MeetingBoardProps{
    meeting: Meeting
    updateAttendanceStatus: Function
}

const MeetingBoard:React.FC<MeetingBoardProps> = ({meeting, updateAttendanceStatus}) => {
    const {Rubric, setRubric} = useRubricContext()
    const [selectRubricModalOpen, setSelectRubricModalOpen] = useState(false);
    const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
    const {Grades, setGrades} = useGradesContext();
    useEffect(()=>{
        if(!Grades || Rubric?.criteria[0].criterionID != Grades[0]?.criterionID){
            let tempGrades:Array<Grade> = []
            Rubric.criteria.forEach(criterion => {
                console.log(criterion.title)
                meeting.queueingEntry.attendanceList.forEach(attendance => {
                    tempGrades.push({
                        studentName:`${capitalizeFirstLetter(attendance.firstname)} ${capitalizeFirstLetter(attendance.lastname)}`,
                        criterionID:criterion.criterionID,
                        meetingID:meeting.meetingID,
                        editionNote:null,
                        grade:0
                    })
                })
            });
            setGrades(tempGrades);
        }
    },[Rubric])
    return (
        <div className='border-2 border-black rounded-md flex flex-col p-3 bg-white gap-3'>
            <p>Consultation Note</p>
            <div className='w-full flex flex-col lg:flex-row xl:flex-row gap-3'>
                <div className='flex-1'>
                    <AttendanceLogger updateAttendanceStatus={updateAttendanceStatus} attendanceList={meeting?.queueingEntry.attendanceList}/>
                </div>
                <div className='flex-1'>
                    <HistoryBoard/>
                </div>
            </div>
            <div className='w-full border-2 border-black'>
                <div className='border-b-2 border-black p-3'>
                    Note Title
                </div>
                <div className='flex flex-col p-3 border-b-2 border-black'>
                    <div className='px-3 font-bold'>
                        Assign student tasks
                    </div>
                    <textarea rows={5} className='p-3' placeholder='These are the deliverables to be checked in the next consultation.'></textarea>
                </div>
                <div className='flex flex-col p-3 border-b-2 border-black'>
                    <div className='px-3 font-bold'>
                        Are there any impediments?
                    </div>
                    <textarea rows={5} className='p-3' placeholder={`List any challenges or obstacles that may affect the progress of each member or group's tasks.`}></textarea>
                </div>
                <div className='flex flex-col p-3'>
                    <div className='px-3 font-bold'>
                        Student Evaluation
                    </div>
                    <div className='text-gray-500 px-3 w-full lg:w-1/2 xl:w-1/2'>
                        Find a suitable rubric to evaluate team members and provide ratings for each member based on their contributions.
                    </div>
                    <div className='flex-grow flex flex-col lg:flex-row xl:flex-row gap-3 px-3'>
                        <table className='w-full mt-3'>
                            <thead>
                                <tr className='border-b-2 p-3'>
                                    <td>Name</td>
                                    <td className='flex justify-center'>Grade</td>
                                </tr>
                            </thead>
                            <tbody>
                                {meeting.queueingEntry.attendanceList.map((member,index)=>(
                                    <tr key={index} className='border-b-2'>
                                        <td className='py-4'>{`${capitalizeFirstLetter(member.firstname)} ${capitalizeFirstLetter(member.lastname)}`}</td>
                                        <td className='flex justify-center items-center py-4'>0</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='w-full lg:w-1/4 xl:w-1/4 flex flex-col items-center justify-center gap-5'>
                            <div className='text-center'>{Rubric?<Typography variant='h6' fontWeight={"bold"}>{Rubric.title}</Typography>:<>No Rubric selected</>}</div>
                            <Button onClick={()=>{setEvaluationModalOpen(true)}} disabled={Rubric?false:true} sx={{backgroundColor:dpurple, color:'white',paddingY:'1.5em'}}>Evaluate Now</Button>
                            <p onClick={()=>{setSelectRubricModalOpen(true)}} className='text-center cursor-pointer' style={{color:dpurple, textDecoration:'underline'}}>{Rubric?<>Change Rubric</>:<>Choose Rubric Now</>}</p>
                        </div>
                    </div>
                </div>
            </div>
            <SelectRubricModal open={selectRubricModalOpen} setOpen={setSelectRubricModalOpen}/>
            <EvaluationModal open={evaluationModalOpen} setOpen={setEvaluationModalOpen}/> 
        </div>
    )
}

export default MeetingBoard
