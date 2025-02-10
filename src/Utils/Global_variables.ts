export const BASE_URL = ''
export const special_characters = ['"',"'",';','-','/','=','(',')','\\','%','/','<','>','&','{','}']

export const lgreen = "#CCFC57"
export const dpurple = "#7D57FC"

export const SPEAR_URL = "http://localhost:8080"
export const QUEUEIT_URL = "http://localhost:8081"

// export interface User{
//     uid:number
//     firstname:string
//     lastname:string
//     email:string
//     password:string
//     role:string
//     isDeleted:boolean
//     interests:string
//     enrolledClasses:Set<Classes>
// }

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
    createdBy:User
    courseType:string
    courseCode:string
    section:string
    schoolYear:string
    semester:string
    courseDescription:string
    classKey:string
    createdDate: Date
    isDeleted:boolean
}

export enum UserType{
    FACULTY = "ADVISER",
    STUDENT = "STUDENT"
}


export interface Team{
    tid:number
    groupName:string
    project:ProjectProposal
    leader:User
    classRef:Classes
    members:Set<User>
    isRecruitmentOpen:boolean
    isDeleted:boolean
}

export interface ProjectProposal{
    pid:number
    proposedBy:User
    projectName:string
    classProposal:Classes
    description:string
    status:string
    reason:string
    adviser:User
    isDeleted:boolean
}

export interface QueueingManager{
    queueID:number
    adviserID:number
    queueingGroups:Array<Team>
    onHoldgroups:Set<Team>
    tendingGroup:Team
    timeEnds:Date
    isActive:Boolean
    cateringLimit:number
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

