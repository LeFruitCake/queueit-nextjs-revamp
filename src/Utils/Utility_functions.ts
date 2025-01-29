import { special_characters } from "./Global_variables"
import Person1 from '../../public/images/Person1.png'
import Person2 from '../../public/images/Person2.png'
import Person3 from '../../public/images/Person3.png'
import Person4 from '../../public/images/Person4.png'
import Person5 from '../../public/images/Person5.png'
import Person6 from '../../public/images/Person6.png'

let PersonArray = [Person1, Person2, Person3, Person4, Person5, Person6];

export function randomPerson() {
    // Generate a random index between 0 and the length of the array - 1
    const randomNumber = Math.floor(Math.random() * PersonArray.length);
    return PersonArray[randomNumber].src;
}

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
