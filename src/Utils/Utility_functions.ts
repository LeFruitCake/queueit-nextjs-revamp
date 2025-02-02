import { special_characters } from "./Global_variables"
import Person1 from '../../public/images/Person1.png'
import Person2 from '../../public/images/Person2.png'
import Person3 from '../../public/images/Person3.png'
import Person4 from '../../public/images/Person4.png'
import Person5 from '../../public/images/Person5.png'
import Person6 from '../../public/images/Person6.png'
import Group1 from '../../public/images/group1.png'
import Group2 from '../../public/images/group2.png'
import Group3 from '../../public/images/group3.png'
import Group4 from '../../public/images/group4.png'
import Group5 from '../../public/images/group5.png'

let PersonArray = [Person1, Person2, Person3, Person4, Person5, Person6];

let GroupArray = [Group1, Group2, Group3, Group4, Group5]

export function randomPerson() {
    // Generate a random index between 0 and the length of the array - 1
    const randomNumber = Math.floor(Math.random() * PersonArray.length);
    return PersonArray[randomNumber].src;
}

export function groupImage(index:number) {
  // Generate a random index between 0 and the length of the array - 1
  const modolus = index%GroupArray.length;
  return GroupArray[modolus].src;
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

export function setMinTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0'); // Get current hours
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Get current minutes
  const currentTime = `${hours}:${minutes}`; // Format as HH:MM

  return currentTime
}

export function convertToTime(expirationTime){
  if(expirationTime){
      const time = expirationTime.split(':').map(Number);
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const baseTimestamp = date.getTime();
      const mills = (time[0] * 60 * 60 * 1000) + (time[1] * 60 * 1000) + (time[2] * 1000);
      const expirationTimestamp = baseTimestamp + mills;
      return expirationTimestamp;
  }
}

export function millisecondsToHMS(milliseconds, setDifference) {
  if(milliseconds){
      // Calculate total seconds
      const totalSeconds = Math.floor(milliseconds  - Date.now());
      
      // Calculate hours, minutes, and seconds
      const hours = Math.floor(totalSeconds / 3600000);
      const minutes = Math.floor((totalSeconds % 3600000) / 60000);
      const seconds = Math.floor((totalSeconds % 60000)/1000);

      // Format to HH:MM:SS
      const formattedTime = [
          String(hours).padStart(2, '0'),
          String(minutes).padStart(2, '0'),
          String(seconds).padStart(2, '0')
      ].join(':');
      setDifference(formattedTime);
  }
}

export function isPastTime(time:number){
  const now = new Date().getTime()
  console.log(time)
  return time < now;
}
