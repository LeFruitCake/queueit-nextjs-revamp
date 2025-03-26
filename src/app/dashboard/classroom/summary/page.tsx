"use client";
import BackButton from '@/Components/BackButton';
import BaseComponent from '@/Components/BaseComponent';
import { useUserContext } from '@/Contexts/AuthContext';
import { useReportSummaryContext } from '@/Contexts/ReportSummaryContext';
import { useTeamContext } from '@/Contexts/TeamContext';
import { Classes, dpurple, lgreen, QUEUEIT_URL, ReportSummaryEntry, SPEAR_URL } from '@/Utils/Global_variables';
import { capitalizeFirstLetter } from '@/Utils/Utility_functions';
import { Typography, TextField, InputAdornment, MenuItem, Select, Button } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import catLoader from '../../../../../../public/loaders/catloader.gif'
import ExportToExcelButton from '@/Components/ExportToExcelButton';
import { useDownloadExcel } from 'react-export-table-to-excel';
import SearchIcon from '@mui/icons-material/Search';

const Page = () => {
    const user = useUserContext().user;
    const team = useTeamContext().Team;
    const [classroom, setClassroom] = useState<Classes>();
    const { ReportSummary, setReportSummary } = useReportSummaryContext();
    const [uniqueNames, setUniqueNames] = useState<Set<string>>(new Set());
    const [uniqueMeetings, setUniqueMeetings] = useState<Set<number>>(new Set());
    const [table, setTable] = useState<string[][]>([]);
    const tableref= useRef(null)
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortCategory, setSortCategory] = useState("All Category");


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
        fetch(`${QUEUEIT_URL}/meeting/teamMeetings/generateSummary/${team?.tid}`)
            .then(async (res) => {
                if (res.ok) {
                    const response = await res.json();
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
            fetchClassroom();
        } else {
            if(team?.adviserId == user?.uid || (classroom.firstname == capitalizeFirstLetter(user?.firstname) && classroom.lastname == capitalizeFirstLetter(user?.lastname) ||  (user?.uid !== undefined && team?.memberIds?.includes(user.uid)) )){
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
        }
    }, [ReportSummary]);

    useEffect(() => {
        if (uniqueMeetings && uniqueNames && ReportSummary) {
            const meetingsArray = Array.from(uniqueMeetings);
            const namesArray = Array.from(uniqueNames);
            let matrix = [];

            for (let i = 0; i < meetingsArray.length + 2; i++) {
                const row = [];
                switch (i) {
                    case 0:
                        row.push("Names");
                        namesArray.forEach(name => row.push(name));
                        break;

                    case meetingsArray.length + 1:
                        row.push("Final Grade");
                        namesArray.forEach((name, colIndex) => {
                            let totalGrade = 0;
                            let count = 0;

                            matrix.forEach((dataRow, rowIndex) => {
                                if (rowIndex !== 0 && rowIndex !== meetingsArray.length + 1) {
                                    const grade = dataRow[colIndex + 1];
                                    if (typeof grade === 'number') {
                                        totalGrade += grade;
                                        count++;
                                    }
                                }
                            });

                            const average = count > 0 ? (totalGrade / count).toFixed(1) : "N/A";
                            row.push(average);
                        });
                        break;

                    default:
                        row.push(`Meeting #${meetingsArray[i - 1]}`);
                        namesArray.forEach(name => {
                            const entry = ReportSummary.reportSummaryEntryList.find(
                                item => item.studentName === name && item.meetingNumber === meetingsArray[i - 1]
                            );
                            row.push(entry ? entry.gradeAverage : "N/A");
                        });
                }
                matrix.push(row);
            }

            setTable(matrix)
        }
    }, [uniqueMeetings, uniqueNames, ReportSummary]);

    const {onDownload} = useDownloadExcel({
        currentTableRef:tableref.current,
        filename:`${classroom?.courseCode}_${classroom?.section}_classroomSummary`,
        sheet:`${team?.groupName}`
    })

    useEffect(() => {
        if (ReportSummary) {
            const transformedData = ReportSummary.reportSummaryEntryList.map(entry => ({
                studentName: entry.studentName,
                groupName: `${team?.groupName}` || "N/A",
                grade: entry.gradeAverage
            }));
            setFilteredData(transformedData);
        }
    }, [ReportSummary]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = ReportSummary.reportSummaryEntryList.filter(entry =>
            entry.studentName.toLowerCase().includes(value) ||
            team?.groupName.toLowerCase().includes(value) ||
            entry.gradeAverage.toString().includes(value)
        ).map(entry => ({
            studentName: entry.studentName,
            groupName: team?.groupName || "N/A",
            grade: entry.gradeAverage
        }));
        setFilteredData(filtered);
    };

    const handleSort = (event) => {
        const category = event.target.value;
        setSortCategory(category);
        let sortedData = [...filteredData];

        if (category === "All Category") {
            sortedData.sort((a, b) => a.studentName.localeCompare(b.studentName));
        } else if (category === "Group Name") {
            sortedData.sort((a, b) => a.groupName.localeCompare(b.groupName));
        } else if (category === "Grade") {
            sortedData.sort((a, b) => b.grade - a.grade);
        }

        setFilteredData(sortedData);
    };

    return (
        <BaseComponent>
            <div className='relative rounded-md bg-dpurple h-full p-6 flex flex-col overflow-hidden gap-10'>
                <div className='flex gap-6 items-center'>
                    <div>
                        <BackButton />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Typography variant='h2' color='white' fontWeight="bold">Section Grades</Typography>
                        <Typography variant='h6' color='white'>Total Students: {uniqueNames.size}</Typography>
                    </div>
                    <div className='ml-auto'>
                        <ExportToExcelButton onClick={onDownload}/>
                    </div>
                </div>
                <div className='flex justify-between items-center mb-4 p-4 bg-white rounded-md'>
                    <TextField
                        variant='outlined'
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ width: '30%' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Select
                        value={sortCategory}
                        onChange={handleSort}
                        displayEmpty
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="All Category">All Category</MenuItem>
                        <MenuItem value="Group Name">Group Name</MenuItem>
                        <MenuItem value="Grade">Grade</MenuItem>
                    </Select>
                </div>
                <div className='flex-1 bg-white overflow-auto relative'>
                    <table className='w-full border-collapse' ref={tableref}>
                        <thead className='sticky top-0 z-10 bg-gray-200'>
                            <tr>
                                <th className='p-4 border'>STUDENT NAME</th>
                                <th className='p-4 border'>GROUP NAME</th>
                                <th className='p-4 border'>GRADE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={index} className='border-b'>
                                    <td className='p-4 border'>{row.studentName}</td>
                                    <td className='p-4 border'>{row.groupName}</td>
                                    <td className='p-4 border'>{row.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseComponent>
    );
};

export default Page;
