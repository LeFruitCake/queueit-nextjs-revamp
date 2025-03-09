"use client";
import BackButton from '@/Components/BackButton';
import BaseComponent from '@/Components/BaseComponent';
import { useUserContext } from '@/Contexts/AuthContext';
import { useReportSummaryContext } from '@/Contexts/ReportSummaryContext';
import { useTeamContext } from '@/Contexts/TeamContext';
import { Classes, dpurple, lgreen, QUEUEIT_URL, ReportSummaryEntry, SPEAR_URL } from '@/Utils/Global_variables';
import { capitalizeFirstLetter } from '@/Utils/Utility_functions';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import catLoader from '../../../../../../public/loaders/catloader.gif'

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
            console.log(classroom.firstname == capitalizeFirstLetter(user?.firstname) && classroom.lastname == capitalizeFirstLetter(user?.lastname))
            if(team?.adviserId == user?.uid || (classroom.firstname == capitalizeFirstLetter(user?.firstname) && classroom.lastname == capitalizeFirstLetter(user?.lastname))){
                fetchReportSummary();
            }
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
            <div className='relative rounded-md bg-dpurple h-full p-6 flex flex-col overflow-hidden gap-10'>
                <div className='flex gap-6 items-center'>
                    <div>
                        <BackButton />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Typography variant='h2' color='white' fontWeight={"bold"}>{team?.groupName}</Typography>
                        <Typography variant='h6' color='white'>{`${classroom?.courseDescription} - ${classroom?.courseCode}`}</Typography>
                    </div>
                </div>
                {ReportSummary?.reportSummaryEntryList.length == 0?
                    <div className='flex-1 bg-white flex flex-col justify-center items-center gap-3'>
                        <img src={catLoader.src} alt="cat" className=''/>
                        <Typography variant='subtitle2' color={dpurple} fontWeight={"bold"}>I don't think the cat has something to show you.</Typography>
                        <Typography variant='caption' color='gray'>Try conducting atleast one meeting with the group first.</Typography>
                    </div>
                    :
                    <div className='flex-1 bg-white overflow-auto'>
                        <table style={{ borderCollapse: 'separate', borderSpacing:'0em 0em'}} className='h-full w-full overflow-hidden bg-black'>
                            <thead>
                                <tr className='h-28'>
                                    <th style={{width:'20em'}}>
                                        <div style={{backgroundColor:'#E9E2FF'}} className='flex-1 h-full flex pl-6 items-center rounded-sm'>
                                            <Typography variant='h6' fontWeight={"bold"}>Names</Typography>
                                        </div>
                                    </th>
                                    {Array.from(uniqueNames).map((name, index) => (
                                        <th key={index}>
                                            <div style={{backgroundColor:'#E9E2FF'}} className='flex-1 h-full flex justify-center items-center border-r-2 rounded-sm'>
                                                <Typography variant='caption' textAlign={"center"}>{name}</Typography>
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
                                                    <div className='flex-1 h-full flex flex-col gap-3 py-3 rounded-sm' style={{backgroundColor:'#E9E2FF'}}>
                                                        <Typography className='pl-6' variant='h6' fontWeight={"bold"}>{`Meeting #${number}`}</Typography>
                                                        <Typography className='pl-6' variant='caption' color='gray'>{new Date(ReportSummary?.reportSummaryEntryList.find(entry => entry.meetingNumber==number)?.meetingDate)?.toDateString()}</Typography>
                                                    </div>
                                                </td>
                                                {grades.map((entry,index)=>(
                                                    <td key={index} className='items-center justify-center h-full'>
                                                        <div className='flex-1 h-full flex flex-col gap-3 rounded-sm' style={{backgroundColor:'white'}} >
                                                            <Typography sx={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}} variant='caption' fontWeight={"bold"}>{entry.gradeAverage}</Typography>
                                                        </div>
                                                    </td>
                                                    
                                                ))}
                                            </tr>
                                        )
                                    })}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <th className='bg-lgreen font-bold py-6' style={{border:'solid 1px black'}}>Final Grade</th>
                                    {Array.from(uniqueNames).map((name, index) => {
                                        const grades = ReportSummary?.reportSummaryEntryList.filter(entry => entry.studentName === name);
                                        let sumGrades = 0;

                                        grades?.forEach(grade => {
                                            sumGrades += grade.gradeAverage;
                                        });

                                        // Calculate the average and round up to the tenths place
                                        const average = grades?.length ? sumGrades / grades.length : 0;
                                        const finalGrade = Math.ceil(average * 10) / 10; // Round up to the tenths place
                                        console.log(`${name}: ${finalGrade}`)

                                        return (
                                            <th key={index} className='bg-lgreen font-bold py-6' style={{border:'solid 1px black'}}>
                                                <Typography fontWeight={"bold"}>{finalGrade != null || finalGrade != undefined? finalGrade.toFixed(1) : <>Calculating</>}</Typography>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                }
            </div>
        </BaseComponent>
    );
};

export default Page;