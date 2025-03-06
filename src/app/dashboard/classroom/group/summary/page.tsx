"use client";
import BackButton from '@/Components/BackButton';
import BaseComponent from '@/Components/BaseComponent';
import { useUserContext } from '@/Contexts/AuthContext';
import { useReportSummaryContext } from '@/Contexts/ReportSummaryContext';
import { useTeamContext } from '@/Contexts/TeamContext';
import { Classes, QUEUEIT_URL, ReportSummaryEntry, SPEAR_URL } from '@/Utils/Global_variables';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
    const user = useUserContext().user;
    const team = useTeamContext().Team;
    const [classroom, setClassroom] = useState<Classes>();
    const { ReportSummary, setReportSummary } = useReportSummaryContext();
    const [uniqueNames, setUniqueNames] = useState<Set<string>>(new Set());
    const [uniqueMeetings, setUniqueMeetings] = useState<Set<number>>(new Set());

    const fetchClassroom = () => {
        fetch(`${SPEAR_URL}/class/${team?.classId}`)
            .then(async (res) => {
                if (res.ok) {
                    const response = await res.json();
                    setClassroom(response);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const fetchReportSummary = () => {
        // console.log(team?.tid);
        fetch(`${QUEUEIT_URL}/meeting/teamMeetings/generateSummary/${team?.tid}`)
            .then(async (res) => {
                if (res.ok) {
                    const response = await res.json();
                    // console.log(response);
                    setReportSummary(response);
                } else {
                    toast.error("Server error");
                }
            })
            .catch((err) => {
                toast.error("Caught an exception while fetching Report Summary");
            });
    };

    useEffect(() => {
        if (!classroom) {
            console.log("Fetching classroom data");
            fetchClassroom();
        } else {
            fetchReportSummary();
        }
    }, [classroom]);

    useEffect(() => {
        if (ReportSummary) {
            const names = new Set<string>();
            const meetings = new Set<number>();
            ReportSummary.reportSummaryEntryList.forEach((entry) => {
                names.add(entry.studentName);
                meetings.add(entry.meetingNumber);
            });
            setUniqueNames(names);
            setUniqueMeetings(meetings);
            // console.log(meetings);
            // console.log(names);
        }
    }, [ReportSummary]);

    return (
        <BaseComponent>
            <div className='relative rounded-md bg-dpurple h-full p-12 flex flex-col overflow-hidden gap-10'>
                <div className='flex gap-6 items-center'>
                    <div>
                        <BackButton />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Typography variant='h2' color='white' fontWeight={"bold"}>{team?.groupName}</Typography>
                        <Typography variant='h6' color='white'>{`${classroom?.courseDescription} - ${classroom?.courseCode}`}</Typography>
                    </div>
                </div>
                <div className='flex-1 bg-white overflow-auto'>
                    <table style={{ borderCollapse: 'separate', borderSpacing:'0em 0.5em'}} className='h-full w-full overflow-hidden p-6'>
                        <thead>
                            <tr className='h-28'>
                                <th style={{width:'20em'}}>
                                    <div style={{backgroundColor:'#E9E2FF'}} className='flex-1 h-full flex justify-center items-center'>
                                        <Typography variant='h6' fontWeight={"bold"} textAlign={"center"}>Names</Typography>
                                    </div>
                                </th>
                                {Array.from(uniqueNames).map((name, index) => (
                                    <th key={index}>
                                        <div style={{backgroundColor:'#E9E2FF'}} className='flex-1 h-full flex justify-center items-center border-r-2'>
                                            <Typography variant='h6' fontWeight={"bold"} textAlign={"center"}>{name}</Typography>
                                        </div>
                                    </th> 
                                ))}
                            </tr>
                        </thead>
                        <tbody className='overflow-auto h-20'>
                                {Array.from(uniqueMeetings).map((number,index)=>
                                {
                                    const grades:Array<ReportSummaryEntry> = ReportSummary?.reportSummaryEntryList.filter(entry => entry.meetingNumber === number )
                                    // console.log(grades)
                                    return (
                                        <tr key={index} className='h-20 '>
                                            <td className='flex items-center justify-center h-full'>
                                                <div className='flex-1 h-full flex flex-col gap-3 py-3' style={{backgroundColor:'#E9E2FF'}}>
                                                    <Typography variant='h6' fontWeight={"bold"} textAlign={"center"}>{`Meeting #${number}`}</Typography>
                                                    <Typography variant='caption' color='gray' textAlign={"center"}>{new Date(ReportSummary?.reportSummaryEntryList.find(entry => entry.meetingNumber==number)?.meetingDate)?.toDateString()}</Typography>
                                                </div>
                                            </td>
                                            {grades.map((entry,index)=>(
                                                <td key={index} className='items-center justify-center h-full'>
                                                    <div className='flex-1 h-full flex flex-col gap-3' style={{backgroundColor:'#E9E2FF'}}>
                                                        <Typography sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}} variant='h6' fontWeight={"bold"}>{entry.gradeAverage}</Typography>
                                                    </div>
                                                </td>
                                                
                                            ))}
                                        </tr>
                                    )
                                })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Final Grade</th>
                                {Array.from(uniqueNames).map((name, index) => 
                                {
                                    const grades = ReportSummary?.reportSummaryEntryList.filter(entry=>entry.studentName == name)
                                    let sumGrades = 0;
                                    grades?.forEach(grade=>{
                                        sumGrades+=grade.gradeAverage
                                    })
                                    const finalGrade = Math.round(sumGrades / grades?.length)
                                return (
                                    <th key={index}>
                                        <Typography>{finalGrade?finalGrade:<>Calculating</>}</Typography>
                                    </th> 
                                )})}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </BaseComponent>
    );
};

export default Page;