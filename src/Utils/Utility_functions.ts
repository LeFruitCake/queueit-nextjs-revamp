import { special_characters } from "./Global_variables"


//used to combat SQL Injection via eliminating entries w/ special characters ensuring regex entries.
export const validateRegex = (string: string) => {
  let chars = string.split('');
  
  // Use some to check if any char matches a special character
  return chars.some(char => special_characters.includes(char));
}


//capitalizes the first letter of a given string
export const capitalizeFirstLetter = (text:string) =>{
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`
}
