"use client"
import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'
import { Avatar, Button, CircularProgress, IconButton, Modal, Typography } from '@mui/material'
import { sampleGroupMembers, sampleTeams } from '@/Sample_Data/SampleData1';
import { capitalizeFirstLetter, randomQuotes, stringAvatar } from '@/Utils/Utility_functions';
import { DonutChartData, dpurple, lgreen, QUEUEIT_URL, ScatterChartData, SPEAR_URL, Team } from '@/Utils/Global_variables';
import { useRouter } from 'next/navigation';
import { useClassroomContext } from '@/Contexts/ClassroomContext';
import person from '../../public/images/pointingUpwardPerson.png'
import whiteStar from '../../public/images/star-white.png'
import whiteSquiggly from '../../public/images/squiggly-white.png'
import GroupBar from './GroupBar';
import { useTeamsContext } from '@/Contexts/TeamsContext';
import { toast } from 'react-toastify';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import SickIcon from '@mui/icons-material/Sick';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

import medalOne from '../../public/images/1st_Place_Medal.png'
import medalTwo from '../../public/images/2nd_Place_Medal.png'
import medalThree from '../../public/images/3rd_Place_Medal.png'
import DonutChart from './DonutChart';
import ScatterChart from './ScatterChart';
import CatLoader from './CatLoader';

interface LowestEngagement{
    teamName:string
    meetingCount:number
}

interface StudentAtRiskEntry{
    firstname:string
    lastname:string
    attendanceCount:string
    gradeAverage:number
    attendanceRate:number
}

interface TopTeam{
    teamName:string
    gradeAverage:number
}

interface PieChartCoord{
    data:Array<number>
    backgroundColor:Array<string>
}

interface PieChartDataEntry{
    labels:Array<string>
    datasets:Array<PieChartCoord>
}

interface AnalyticsResult{
    lowestEngagementDTO:Array<LowestEngagement>
    atRiskForKickOuts:Array<StudentAtRiskEntry>
    topTeams:Array<TopTeam>
    pieChartData:PieChartDataEntry
    scatterPlotDataset:ScatterChartData
}


const GroupDetailAdviserView = () => {
    const {Teams, setTeams} = useTeamsContext();
    const classroomContext = useClassroomContext().classroom
    const [classroom, setClassroom] = useState(classroomContext)
    const [viewEnrolleesModalOpen, setViewEnrolleesModalOpen] = useState(false)
    const [analyticsData, setAnalyticsData] = useState<AnalyticsResult | undefined>()
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


    useEffect(()=>{
        if(classroom){
            fetch(`${SPEAR_URL}/classroom/team/${classroom?.cid}`)
            .then( async (res)=>{
                switch(res.status){
                    case 200:
                        const response:Array<Team> = await res.json(); 
                        setTeams(response)
                        break;
                    case 404:
                        setTeams(undefined)
                        break;
                    default:
                        toast.error("Server error")
                }
            })
            .catch((err)=>{
                toast.error("Caught an exception while fetching teams.")
                console.log(err)
            })

            fetch(`${QUEUEIT_URL}/faculty/classroomAnalytics/${classroom.cid}`)
            .then(async(res)=>{
                if(res.ok){
                    const response:AnalyticsResult = await res.json();
                    const teacherNames = new Set<string>
                    // const studentIDs = new Set<number>
                    const teamNames = new Set<string>
                    Teams?.map((team)=>{
                        teacherNames.add(team.adviserName)
                        // team.memberIds.map((id)=>{
                        //     studentIDs.add(id)
                        // })
                        teamNames.add(team.groupName)
                    })
                    teacherNames.forEach(name=>{
                        if(!response.pieChartData.labels.includes(name)){
                            response.pieChartData.labels.push(name);
                            response.pieChartData.datasets[0].backgroundColor.push('red')
                            response.pieChartData.datasets[0].data.push(0)
                        }
                    })
                    teamNames.forEach(teamName=>{
                        if(!response.scatterPlotDataset.datasets.filter(dataset => dataset.label == teamName).length){
                            response.scatterPlotDataset.datasets.push({
                                "backgroundColor":'red',
                                "data":[{
                                    "x":0,
                                    "y":0
                                }],
                                "label":teamName
                            })
                        }
                    })
                    setAnalyticsData(response);
                }else{
                    console.log("Failed to retrieve analytics.")
                }
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    },[classroom])

    if(!Teams && !analyticsData){
        return(
            <CatLoader loading={!Teams && !analyticsData}/>
        )
    }else{
        return (
            <div className='flex flex-col flex-grow w-full h-fit relative mt-5 rounded-md p-6 gap-6' style={{backgroundColor:'#F4F7FE'}}>
    
                {/* classroom general information */}
                <div className='h-fit flex w-full p-3 bg-dpurple justify-between items-center rounded-md'>
                    <div className='flex gap-12 items-center '>
                        <BackButton/>
                        <div className='flex flex-col gap-3'>
                        <Typography variant='h5' className='text-white text-lg font-bold'>{classroom?.courseDescription}</Typography>
                        <Typography variant='caption' className='text-white text-lg'>{`${classroom?.courseCode} - ${classroom?.section}`}</Typography>
                        </div>
                    </div>
                    <Button sx={{backgroundColor:lgreen, color:'black', textTransform:'none', fontWeight:'bold', padding:'0.5em 2em'}}>Class Record</Button>
                </div>
    
                {/* 2nd row charts */}
                <div className='w-full flex gap-6'>
    
                    {/* team perfomance rankings */}
                    <div className='bg-white p-6 flex-1 rounded-md gap-12 flex flex-col'>
                        <Typography variant='h6' fontWeight={"bold"} textAlign={"center"}>{`Top Teams`}</Typography>
                        {analyticsData?.topTeams?
                            <div className='w-full flex items-end'>
                                {
                                    analyticsData?.topTeams.length >= 2?
                                    <div className='bg-gradient-to-b from-dpurple to-white h-48 flex-1 relative rounded-md rounded-tr-none'>
                                        <img src={medalTwo.src} alt="2nd place medal" style={{margin:'0 auto'}}/>
                                        <div className='flex-grow flex flex-col items-center justify-center p-3'>
                                            <Typography variant='h5' fontWeight={"bold"}>{analyticsData?.topTeams[1]?.teamName}</Typography>
                                            <Typography variant='subtitle1' fontWeight={"bold"}>{analyticsData?.topTeams[1]?.gradeAverage}</Typography>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                                <div className='bg-gradient-to-b from-lgreen to-white h-64 flex-1 relative rounded-md flex flex-col'>
                                    <img src={medalOne.src} alt="1st place medal" style={{margin:'0 auto'}}/>
                                    <div className='flex-grow flex flex-col items-center justify-center p-3'>
                                        <Typography variant='h5' fontWeight={"bold"}>{analyticsData?.topTeams[0]?.teamName}</Typography>
                                        <Typography variant='subtitle1' fontWeight={"bold"}>{analyticsData?.topTeams[0]?.gradeAverage}</Typography>
                                    </div>
                                </div>
                                {
                                    analyticsData?.topTeams.length >= 3?
                                    <div className='bg-gradient-to-b from-dpurple to-white h-32 flex-1 relative rounded-md rounded-tl-none'>
                                        <img src={medalThree.src} alt="3rd place medal" style={{margin:'0 auto'}}/>
                                        <div className='flex-grow flex flex-col items-center justify-center p-3'>
                                            <Typography variant='h5' fontWeight={"bold"}>{analyticsData?.topTeams[2]?.teamName}</Typography>
                                            <Typography variant='subtitle1' fontWeight={"bold"}>{analyticsData?.topTeams[2]?.gradeAverage}</Typography>
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                            :
                            <></>
                        }
                    </div>
    
    
                    
                    <div className='flex-1 rounded-md flex gap-3 bg-white items-center'>
                        {
                            analyticsData?.scatterPlotDataset?
                            <ScatterChart dataset={analyticsData?.scatterPlotDataset} chartTitle='Teams Performance Indicator'/>
                            :
                            <CircularProgress/>
                        }
                    </div>
                </div>
    
                <div className='w-full flex gap-6'>
                    {
                        analyticsData?.lowestEngagementDTO?.length?
                        <div className='bg-white min-h-40 max-h-80 overflow-auto p-3 rounded-md flex-1 flex flex-col'>
                            <Typography variant='caption' color='gray' fontWeight={"bold"} sx={{display:'flex', gap:'1em'}}> <HeartBrokenIcon fontSize='small' className='text-notlushred'/>Teams With Low Engagement</Typography>
                            <div className='flex-grow flex items-center justify-between'>
                                
                            </div>
                        </div>
                        :
                        <></>
                    }
                    {
                        analyticsData?.atRiskForKickOuts.length?
                        <div className='bg-white min-h-40 max-h-80 overflow-auto p-3 rounded-md flex-1 flex flex-col'>
                            <Typography variant='caption' color='gray' fontWeight={"bold"} sx={{display:'flex', gap:'1em'}}> <SickIcon fontSize='small' className='text-notlushred'/> Low Performant Students </Typography>
                            <div className='flex-grow flex items-center justify-between'>
                                
                            </div>
                        </div>
                        :
                        <></>
                    }
                </div>
                {/* <div className='w-full flex gap-6'>
                    <div className='bg-white min-h-40 p-3 rounded-md flex-1 flex flex-col'>
                        <Typography variant='caption' color='gray' fontWeight={"bold"} sx={{display:'flex', gap:'1em'}}> <KeyboardDoubleArrowDownIcon fontSize='small' className='text-notlushred'/> Teams With Declining Performance</Typography>
                        <div className='flex-grow flex items-center justify-between'>
                            
                        </div>
                    </div>
                </div> */}
    
                <div className='flex gap-6 w-full'>
                   <div className='bg-white p-6 rounded-md flex flex-col gap-6 flex-grow overflow-auto'>
                        <Typography variant='h6' fontWeight={"bold"}>Teams</Typography>
                        {Teams?.map((team,index)=>(
                            <GroupBar key={index} team={team} index={index}/>
                        ))}
                   </div>
                   <div className='bg-white p-6 rounded-md flex flex-col gap-6 w-1/3 aspect-square h-fit'>
                        {
                            analyticsData?.pieChartData?
                            <DonutChart chartData={analyticsData?.pieChartData} chartTitle='Mentor Performance'/>
                            :
                            <CircularProgress/>
                        }
                   </div>
                </div>
    
                
            </div>
        
        )
    }
}

export default GroupDetailAdviserView