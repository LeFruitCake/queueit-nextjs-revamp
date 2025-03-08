export const BASE_URL = ''
export const special_characters = ['"',"'",';','-','/','=','(',')','\\','%','/','<','>','&','{','}']

export const lgreen = "#CCFC57"
export const dpurple = "#7D57FC"

export const SPEAR_URL = "http://localhost:8080"
export const QUEUEIT_URL = "http://localhost:8081"


//user given when querying to spear db using id.
export interface UserRetrieved{
    uid:number
    firstname:string
    lastname:string
    email:string
    password:string
    role:string
    isDeleted:boolean
    interests:string
    enrolledClasses:Set<Classes>
}

export interface ReportSummaryEntry{
    meetingNumber:number
    meetingDate:Date
    gradeAverage:number
    studentName:string
}

export interface ReportSummary{
    reportSummaryEntryList:Array<ReportSummaryEntry>
}

export interface MeetingBoardHistoryEntry{
    notedAssignedTasks:string
    impedimentsEncountered:string
    start:Date
    end:Date
    attendanceList:Array<Attendance>
    meetingStatus: MeetingStatus
}

//user on log in
export interface User{
    deleted:boolean
    expirationTime:string
    message:string
    refreshToken:string
    role:string
    statusCode:number
    token:string
    uid:number
    firstname:string
    lastname:string
}

export interface Classes{
    cid:number
    courseType:string
    courseCode:string
    section:string
    schoolYear:string
    semester:string
    courseDescription:string
    classKey:string
    createdDate: Date
    deleted:boolean
    firstname:string
    lastname:string
    role:string
    uid:number
}

export enum UserType{
    FACULTY = "TEACHER",
    STUDENT = "STUDENT"
}

export enum AttendanceStatus{
    PRESENT = "PRESENT",
    LATE = "LATE",
    ABSENT = "ABSENT"
}

export interface Faculty{
    firstname:string|undefined
    lastname:string|undefined
    uid:number|undefined
}


export interface Team{
    tid:number
    groupName:string
    // projectName:string
    projectId:number
    leaderId:number
    classId:number
    memberIds:Array<number>
    memberNames:Array<string>
    features:null
    projectDescription:string
    adviserId:number
    scheduleId:number
    recruitmentOpen:boolean
}

export interface TeamQueueitDTO{
    teamID:number
    teamName:string
    courseCode:string
    section:string
    memberIds:Array<number>
}

export interface Schedule{
    schedid:number
    day:string
    time:string
    teacherId:number
    teacherName:string
}

export interface ProjectProposal{
    pid:number
    proposedById:number
    projectName:string
    classId:Classes
    description:string
    status:string
    reason:string
    adviserId:number
    courseCode:string
}

export interface ChatDTO{
    userID:number
    adviserID:number
    message:string
    firstname:string
    lastname:string
}

export interface QueueingManager{
    queueingManagerID:number
    facultyID:number
    timeEnds:string
    isActive:boolean
    cateringLimit:number
    queueingEntries:Array<QueueingEntry> | null
    meeting: Meeting | null | undefined
    cateredClassrooms:Array<number | null>
}

export interface QueueingEntry{
    queueingEntryID:number
    teamID:number
    teamName:string
    classReference:string
    queueingManager:QueueingManager
    dateTimeQueued:Date
    onHold:boolean
    attendanceList:Array<Attendance>
}

export interface MeetingEdition{
    userID:number
    edition:Date
    editionNote:String
}

export interface Grade{
    meetingID:number
    criterionID:number
    editionNote:string|null
    studentName:string
    grade:number
}

export enum MeetingStatus{
    FAILED_TEAM_NO_SHOW = "FAILED_TEAM_NO_SHOW",
    FAILED_FACULTY_NO_SHOW = "FAILED_FACULTY_NO_SHOW",
    ATTENDED_FACULTY_CONDUCTED = "ATTENDED_FACULTY_CONDUCTED",
    ATTENDED_QUEUEING_CONDUCTED = "ATTENDED_QUEUEING_CONDUCTED",
    FAILED_DEFAULTED = "FAILED_DEFAULTED",
    SET_AUTOMATED = "SET_AUTOMATED",
    SET_MANUALLY = "SET_MANUALLY",
    CANCELLED = "CANCELLED",
}

export interface Meeting{
    meetingID:number
    start:string
    end:string
    grades:Array<Grade>
    meetingStatus:MeetingStatus
    queueingEntry:QueueingEntry
}

export interface AttendanceDTO{
    studentID:number
    attendanceStatus:AttendanceStatus
}

export interface Criterion{
    criterionID:number
    rubric:Rubric
    title:string
    description:string
}

export interface CriterionDTO{
    title:string|null|undefined
    description:string|null|undefined
}

export interface Rubric{
    id:number
    title:string
    description:string
    criteria:Array<Criterion>
    isPrivate:boolean
    userID:number
    facultyName:string
}

export interface RubricDTO{
    title:string|null|undefined
    description:string|null|undefined
    criteria:Array<CriterionDTO>
    isPrivate:boolean
}

export interface Chat{
    userID:number
    firstname:string
    lastname:string
    message:string
}

export interface Attendance{
    // studentID:number
    studentEmail:string
    firstname:string
    lastname:string
    attendanceStatus:AttendanceStatus
}

