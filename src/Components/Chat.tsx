import { Chat, User } from '@/Utils/Global_variables'
import { capitalizeFirstLetter } from '@/Utils/Utility_functions'
import { IconButton, Typography } from '@mui/material'
import React from 'react'
import SendIcon from '@mui/icons-material/Send';

interface ChatProps{
    chat:Chat | null
    adviser: User | null
}

const Chat:React.FC<ChatProps> = ({chat, adviser}) => {
    return (
        <div className='border-2 p-3 border-black rounded-md bg-white flex flex-col flex-grow min-h-96 justify-end'>
            <div className='overflow-auto flex flex-col h-80 md:h-full lg:h-full xl:h-full'>
                {adviser?<Typography variant='subtitle2' fontWeight={'bold'} className='text-center'>Welcome to {capitalizeFirstLetter(adviser.firstname)} {`${capitalizeFirstLetter(adviser.lastname)}'s chat.`}</Typography>:<></>}
            </div>
            <div className='flex justify-self-end'>
                <input type="text" className='border-2 border-black rounded-md p-3 flex-grow ' />
                <IconButton><SendIcon sx={{color:'black'}}/></IconButton>
            </div>
        </div>
    )
}

export default Chat
