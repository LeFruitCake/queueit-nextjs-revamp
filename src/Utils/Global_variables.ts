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

export interface Faculty{
    firstname:string|undefined
    lastname:string|undefined
    uid:number|undefined
}


export interface Team{
    tid:number
    groupName:string
    projectName:string
    projectId:number
    leaderId:number
    classId:number
    memberIds:Array<number>
    features:null
    projectDescription:string
    recruitmentOpen:boolean
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
    queueID:number
    facultyID:number
    timeEnds:string
    isActive:boolean
    cateringLimit:number
    queueingEntries:Array<QueueingEntry>
    cateredClassrooms:Array<Classroomv2>
}

interface Classroomv2{
    classroomID:number
    facultyID:number
    queueingManager:QueueingManager
}

interface QueueingEntry{
    queueingEntryID:number
    team:QueueingEntryTeam
    queueingManager:QueueingManager
    dateTimeQueued:Date
    isOnHold:boolean
}

interface QueueingEntryTeam{
    teamID:number
    teamName:string
    courseCode:string
    section:string
    memberIds:Array<number>
    queueingEntry:QueueingEntry
}

export interface MeetingEdition{
    userID:number
    edition:Date
    editionNote:String
}

export interface Grade{
    userID:number
    meetingID:number
    criterionID:number
    editionNote:string
    grade:number
}

export interface Meeting{
    meetingID:number
    adviserID:number
    groupID:number
    start:Date
    end:Date
    meetingDate:Date
    attendance:Set<Number>
    editedAttendance:Set<MeetingEdition>
    grades:Set<Grade>
    isDefaulted:boolean
    defaultedLog:string
}

export interface Criterion{
    criterionID:number
    rubric:Rubric
    title:string
    description:string
}

export interface Rubric{
    rubricID:number
    title:string
    description:string
    criteria:Set<Criterion>
    isPrivate:boolean
    creator:User
}

export interface Chat{
    userID:number
    firstname:string
    lastname:string
    message:string
}

