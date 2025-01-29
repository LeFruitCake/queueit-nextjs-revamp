export const BASE_URL = ''
export const special_characters = ['"',"'",';','-','/','=','(',')','\\','%','/','<','>','&','{','}']
export const primaryColor = "#046AD8"

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
