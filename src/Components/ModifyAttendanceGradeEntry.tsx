import { Attendance, AttendanceStatus, Grade, lgreen, QUEUEIT_URL } from '@/Utils/Global_variables'
import { Chip, CircularProgress, Modal, Slider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import EvaluationModal from './EvaluationModal'
import { useGradesContext } from '@/Contexts/GradesContext'
import AttendanceLogger from './AttendanceLogger'
import AttendanceLoggerCard from './AttendanceLoggerCard'
import IndexEnumerator from './IndexEnumerator'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import rocket from '../../public/images/rocket-thumb.png'

interface ModifyAttendanceGradeEntryProps{
    meetingID:number
    studentFirstname:string
    studentLastname:string
}

interface props{
    props:ModifyAttendanceGradeEntryProps | undefined
    open:boolean
    setOpen:Function
}

const ModifyAttendanceGradeEntry:React.FC<props> = ({props, open, setOpen}) => {
    
    const [attendance, setAttendance] = useState<Attendance>()
    const {Grades, setGrades}=useGradesContext()
    const [loading, setLoading] = useState(true)
    
    useEffect(()=>{
        if(props?.studentFirstname && props?.studentLastname && props?.meetingID){
            fetch(`${QUEUEIT_URL}/meeting/teamMeetings/attendanceGradeForEdition`,{
                body:JSON.stringify({
                    "meetingID":props.meetingID,
                    "firstName":props.studentFirstname,
                    "lastName":props.studentLastname
                }),
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(async(res)=>{
                if(res.ok){
                    const response = await res.json();
                    console.log(response)
                    setGrades(response.grade)
                    setAttendance(response.attendance)
                }else{
                    const err_text = await res.text();
                    toast.error(err_text)
                }
            })
            .catch((err)=>{
                console.log(err)
                toast.error("Caught an exception while fetching attendance and grade")
            })
            .finally(()=>{
                setLoading(false)
            })
        }
    },[props])

    const updateAttendanceStatus = (studentEmail: string) => {
        if(studentEmail == attendance?.studentEmail){
            setAttendance(
                {
                    ...attendance,
                    attendanceStatus: attendance.attendanceStatus === AttendanceStatus.PRESENT
                                    ? AttendanceStatus.ABSENT
                                    : attendance.attendanceStatus === AttendanceStatus.ABSENT
                                    ? AttendanceStatus.LATE
                                    : AttendanceStatus.PRESENT
                }
            )
        }
    };

    const marks = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
    ];

    const handleSliderChange = (studentName: string, newValue: number, criterionID: number) => {
        setGrades(prevGrades => 
            prevGrades.map(grade => 
                grade.studentName === studentName && grade.criterionID === criterionID
                    ? { ...grade, grade: newValue } // Update the grade
                    : grade // Return the original grade
            )
        );
    };
    
    return (
        <Modal open={open} onClose={()=>{setOpen(false)}}>
            <div className='bg-white absolute w-2/3 h-2/3 overflow-auto p-10 flex flex-col gap-3 rounded-md' style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                {loading?
                    <CircularProgress/>
                    :
                    <div className='p-10'>
                        <AttendanceLoggerCard updateAttendanceStatus={updateAttendanceStatus} attendance={attendance}/>
                        {Grades?.map((gradeEntry,index)=>(
                            <div key={index} className='flex flex-col gap-3'>
                                <div className='flex gap-6'>
                                    <div className='h-fit'>
                                        <IndexEnumerator index={index + 1} />
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <Typography variant='h4' fontWeight={"bold"}>{gradeEntry.criterion.title}</Typography>
                                        <Typography variant='caption'>{gradeEntry.criterion.description}</Typography>
                                    </div>
                                </div>
                                <div className='px-20 py-2 gap-6 flex flex-col'>
                                    <div key={index} className='flex flex-col gap-3'>
                                        <div className='flex gap-3 items-center'>
                                            <Typography fontWeight={"bold"} variant='h6'>{capitalizeFirstLetter(attendance.firstname)} ${capitalizeFirstLetter(attendance.lastname)}</Typography>
                                            {attendance.attendanceStatus === AttendanceStatus.ABSENT ?
                                                <Chip size='small' label="Absent" sx={{ backgroundColor: 'rgba(255,102,102,0.5)', color: 'white' }} />
                                                : <></>
                                            }
                                        </div>
                                        <div className='flex flex-col gap-3 rounded-md py-6 px-10' style={{ border: 'solid 0.1px gray', backgroundColor:'#F9F9F9' }}>
                                            <Slider
                                                marks={marks}
                                                disabled={attendance.attendanceStatus === AttendanceStatus.ABSENT}
                                                size="medium"
                                                value={gradeEntry.mark || 0} // Use the grade from context
                                                min={0}
                                                max={5}
                                                step={0.1}
                                                aria-label="Small"
                                                valueLabelDisplay="auto"
                                                onChange={(event, newValue) => handleSliderChange(studentName, newValue, criterion.criterionID)} // Update grade on change
                                                sx={{
                                                    color: lgreen,
                                                    '& .MuiSlider-thumb': {
                                                        width: '60px',
                                                        height: '60px',
                                                        backgroundColor: 'transparent',
                                                        '&:hover': {
                                                            backgroundColor: 'transparent',
                                                        },
                                                        '&::before': {
                                                            display: attendance.attendanceStatus === AttendanceStatus.ABSENT ? 'none' : '',
                                                            content: '""',
                                                            backgroundImage: `url(${rocket.src})`,
                                                            backgroundSize: 'contain',
                                                            backgroundRepeat: 'no-repeat',
                                                            width: '80px',
                                                            height: '80px',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -37%)',
                                                            border:'none',
                                                            boxShadow:'none'
                                                        },
                                                    },
                                                    '& .MuiSlider-track': {
                                                        background: lgreen,
                                                    },
                                                    '& .MuiSlider-rail': {
                                                        background: `linear-gradient(to right, black, ${lgreen})`,
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </Modal>
    )
}

export default ModifyAttendanceGradeEntry