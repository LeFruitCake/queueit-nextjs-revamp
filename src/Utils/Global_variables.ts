export const BASE_URL = ''
export const special_characters = ['"',"'",';','-','/','=','(',')','\\','%','/','<','>','&','{','}']

export const lgreen = "#CCFC57"
export const dpurple = "#7D57FC"

export interface User{
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