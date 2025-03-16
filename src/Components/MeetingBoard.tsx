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
import { MentionsInput, Mention } from "react-mentions";

interface MeetingBoardProps{
    meeting: Meeting
    updateAttendanceStatus: Function
    setImpedimentsEncountered: Function
    setNotedAssignedTasks: Function
}

const MeetingBoard:React.FC<MeetingBoardProps> = ({meeting, updateAttendanceStatus, setImpedimentsEncountered, setNotedAssignedTasks}) => {
    const {Rubric, setRubric} = useRubricContext()
    const [selectRubricModalOpen, setSelectRubricModalOpen] = useState(false);
    const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
    const {Grades, setGrades} = useGradesContext();
    const [taskNote, setTaskNote] = useState("");
    const [impedimentNote, setImpedimentNote] = useState("");
    
    useEffect(()=>{
        if(!Grades || Rubric?.criteria[0].criterionID != Grades[0]?.criterionID){
            let tempGrades:Array<Grade> = []
            Rubric?.criteria.forEach(criterion => {
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

    const getUniqueStudents = () => {
        return meeting.queueingEntry.attendanceList.map((student) => ({
          id: student.firstname + " " + student.lastname,
          display: student.firstname + " " + student.lastname,
        }));
      };

    // Assuming `Grades` is your array of student data
    const getUniqueStudentsWithAveragedGrades = () => {
    // Create a new object to store the aggregated data
    const studentGrades = {};

    // Loop through the grades to aggregate the data by student name
    Grades?.forEach((member) => {
        if (studentGrades[member.studentName]) {
            // Add to the existing grades for that student
            studentGrades[member.studentName].totalGrade += member.grade;
            studentGrades[member.studentName].count += 1;
        } else {
            // Initialize the data for a new student
            studentGrades[member.studentName] = {
                totalGrade: member.grade,
                count: 1
            };
        }
    });

    const averagedGrades = Object.keys(studentGrades).map((studentName) => {
        const { totalGrade, count } = studentGrades[studentName];
        return {
            studentName,
            grade: totalGrade / count, // Calculate the average grade
        };
    });

    return averagedGrades;
    };

    const averagedGrades = getUniqueStudentsWithAveragedGrades();
    return (
        <div className='border-2 border-black rounded-md flex flex-col p-3 bg-white gap-3'>
            <p>Consultation Note</p>
            <div className='w-full flex flex-col lg:flex-row xl:flex-row gap-3 max-h-80 overflow-hidden'>
                <div className='flex-1'>
                    <AttendanceLogger updateAttendanceStatus={updateAttendanceStatus} attendanceList={meeting?.queueingEntry.attendanceList}/>
                </div>
                <div className='flex-1'>
                    <HistoryBoard/>
                </div>
            </div>
            <div className='w-full border-2 border-black rounded-md'>
                <div className='border-b-2 border-black p-3' style={{ backgroundColor: "#7D57FC" }}>
                    Note Title
                </div>
                <div className='flex flex-col p-3 border-b-2 border-black'>
                    <div className='px-3 font-bold'>Assign student tasks</div>
                    <div className='p-3'>
                    <MentionsInput
                        value={taskNote}
                        onChange={(e) => {
                            setTaskNote(e.target.value);
                            setNotedAssignedTasks(e.target.value);
                        }}
                        className="rounded-md w-full" 
                        style={{ minHeight: "120px" }} 
                        placeholder={`These are the deliverables to be checked in the next consultation.\nMention students with @...`}
                    >
                        <Mention 
                            trigger="@" 
                            data={getUniqueStudents()} 
                            markup="@__display__:" 
                            displayTransform={(display) => `@${display}`} 
                            style={{
                                backgroundColor: "#E5E5E5",
                                borderRadius: "6px", 
                                display: "inline-block", 
                                padding: "2px "
                            }} 
                        /> 
                    </MentionsInput> 
                    </div>
                </div>
                <div className='flex flex-col p-3 border-b-2 border-black'>
                    <div className='px-3 font-bold'>Are there any impediments?</div>
                    <div className='p-3'>
                        <MentionsInput
                            value={impedimentNote}
                            onChange={(e) => {
                                setImpedimentNote(e.target.value);
                                setImpedimentsEncountered(e.target.value);
                            }}
                            className="rounded-md w-full " 
                            style={{ minHeight: "120px" }} 
                            placeholder={`List any challenges or obstacles that may affect the progress of each member or group's tasks.\nMention students with @...`}>
                            <Mention 
                                trigger="@" 
                                data={getUniqueStudents()} 
                                markup="@__display__:" 
                                displayTransform={(display) => `@${display}`} 
                                style={{
                                    backgroundColor: "#E5E5E5",
                                    borderRadius: "6px", 
                                    display: "inline-block", 
                                    padding: "2px "
                                }} 
                            /> 
                        </MentionsInput>
                    </div>
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
                            {averagedGrades.map((member, index) => (
                                <tr key={index} className='border-b-2'>
                                    <td className='py-4'>{member.studentName}</td>
                                    <td className='flex justify-center items-center py-4'>{member.grade.toFixed(2)}</td>
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
